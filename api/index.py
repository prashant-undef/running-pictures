from flask import Flask, request

# common dependencies
import os
from os import path
import warnings
import time
import pickle
import logging
from deepface import DeepFace
import uuid

# 3rd party dependencies
import numpy as np
import pandas as pd
from tqdm import tqdm
import cv2
import tensorflow as tf
import faiss
from prisma import Prisma


# package dependencies
from deepface.basemodels import (
    VGGFace,
    OpenFace,
    Facenet,
    Facenet512,
    FbDeepFace,
    DeepID,
    DlibWrapper,
    ArcFace,
    SFace,
)
from deepface.extendedmodels import Age, Gender, Race, Emotion
from deepface.commons import functions, realtime, distance as dst

from sanic import Sanic
from sanic.response import json, HTTPResponse, text, file
from sanic.request import Request

import pyrebase


app = Sanic("runners")
# app.ctx.db = Prisma()
# firebaseConfig = {
#     "apiKey": "AIzaSyDv8RYsBJPCLG_wR7zEC-HV-6zuoRclfhI",
#     "authDomain": "running-picture-s.firebaseapp.com",
#     "projectId": "running-picture-s",
#     "databaseURL": None,
#     "storageBucket": "running-picture-s.appspot.com",
#     "messagingSenderId": "641078004574",
#     "appId": "1:641078004574:web:fe79eff9c265bfb7f4ddcf",
#     # "serviceAccount": "running-pictures-403910-803fb2a883d4.json",
# }

firebaseConfig = {
    "apiKey": "AIzaSyDoxac8pf0RptHfknzqMZB9IIkqe3hmr6Q",
    "authDomain": "running-pictures2.firebaseapp.com",
    "projectId": "running-pictures2",
    "databaseURL": None,
    "storageBucket": "running-pictures2.appspot.com",
    "messagingSenderId": "449426600345",
    "appId": "1:449426600345:web:3752ab652428fc7e9fe308",
    # "serviceAccount": "running-pictures-403910-803fb2a883d4.json",
}
firebase = pyrebase.initialize_app(firebaseConfig)

app.ctx.storage = firebase.storage()
app.ctx.db = Prisma()


@app.listener("before_server_start")
async def setup_db_connection(app, loop):
    await app.ctx.db.connect()


@app.listener("after_server_stop")
async def close_db_connection(app, loop):
    await app.ctx.db.disconnect()


@app.route("/api/python")
def hello_world(request):
    return "<p>Hello, World!</p>"


@app.post("/api/uploadImage")
async def upload_image(request: Request) -> HTTPResponse:
    if "image" not in request.files:
        return json({"error": "No file uploaded"})

    image = request.files.get("image")

    if image is None:
        return json({"message": "Please provide an image"})

    if not image.type.startswith("image/"):
        return json({"error": "Uploaded file is not an image"})

    storage = app.ctx.storage

    try:
        storage.child(image.name).put(image.body)
        image_url = storage.child(image.name).get_url(None)
        return json({"image_url": image_url})
    except Exception as e:
        return json({"error": str(e)})

    # print("image", image)

    # # return raw(image)

    # image_url = storage.child(f"images/test.jpg").put(image)
    # print(image_url)

    # db = app.ctx.db

    # event = await db.event.find_first(where={"slug": event_slug})

    # return json({"id": event.id, "name": event.name, "slug": event.slug})
    # return text(image_url)


@app.post("/api/indexFaces")
async def index_faces(request: Request) -> HTTPResponse:
    print(request)
    input_args = request.json

    if input_args is None:
        return {"message": "empty input set passed"}

    event_name = input_args.get("event_name")
    image_url = input_args.get("image_url")

    db = app.ctx.db

    print(image_url)

    if image_url is None:
        return json({"message": "you must pass image_url input"})
    elif event_name is None:
        return json({"message": "you must pass event input"})

    event = await db.event.find_first(where={"slug": "runathon-of-hope"})

    if not event:
        event = await db.event.create(
            {
                "name": event_name,
                "slug": "runathon-of-hope",
                "featuredImageURL": "https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/PHOTO-2023-10-09-10-54-48.avif?alt=media&token=500b7a77-9142-4fea-99f7-1b8170d1ac70",
                "city": "Pune",
                "date": "08 Oct 2023",
            }
        )

    # return image_url

    model_name = input_args.get("model_name", "VGG-Face")
    detector_backend = input_args.get("detector_backend", "retinaface")
    enforce_detection = input_args.get("enforce_detection", True)
    distance_metric = input_args.get("distance_metric", "euclidean_l2")
    align = input_args.get("align", True)
    normalization = input_args.get("normalization", "base")
    silent = input_args.get("silent", False)

    representaions = []

    print(image_url)
    img_objs = functions.extract_faces(
        img=image_url,
        # target_size=target_size,
        detector_backend=detector_backend,
        grayscale=False,
        enforce_detection=enforce_detection,
        align=align,
    )

    for img_content, _, _ in img_objs:
        embedding_obj = DeepFace.represent(
            img_path=img_content,
            model_name=model_name,
            enforce_detection=enforce_detection,
            detector_backend="skip",
            align=align,
            normalization=normalization,
        )

        img_representation = embedding_obj[0]["embedding"]
        face = await db.face.create(
            {
                "embedding": img_representation,
                "image_url": image_url,
                "eventId": event.id,
            }
        )

        representaions.append(face)

    return json({"status": "Success!"})


@app.post("/api/searchFacesByImage")
async def search_faces_by_image(request: Request) -> HTTPResponse:
    input_args = request.json

    if input_args is None:
        return {"message": "empty input set passed"}

    image_url = input_args.get("image_url")

    db = app.ctx.db

    start_time = time.time()

    temp_embeds = await db.face.find_many()
    embeddings = [face.embedding for face in temp_embeds]
    # embeddings = faiss.normalize_L2(embeddings)
    np.random.seed(1234)
    embeddings_np = np.array(embeddings, dtype=np.float32)
    d = embeddings_np.shape[1]
    # faiss.normalize_L2(embeddings_np)
    index = faiss.IndexFlatL2(d)

    index.add(embeddings_np)

    # temp_embeds = await db.face.find_many()

    # embeddings = [face.embedding for face in temp_embeds]

    # print(type(temp_embeds[0]))

    # np.random.seed(1234)
    # embeddings_np = np.array(embeddings, dtype=np.float32)
    # d = embeddings_np.shape[1]

    # # index = faiss.IndexFlatL2(d)

    # nlist = 25
    # quantizer = faiss.IndexFlatL2(d)
    # index = faiss.IndexIVFFlat(quantizer, d, nlist)
    # assert not index.is_trained
    # index.train(embeddings_np)
    # assert index.is_trained
    # faiss.normalize_L2(embeddings_np)
    # index.add(embeddings_np)
    # index.nprobe = 25
    start_time = time.time()

    query_embed = DeepFace.represent(
        image_url,
        detector_backend="retinaface",
        model_name="ArcFace",
    )

    image_path = image_url.split("com/o/")[1].split("?")[0].replace("%20", " ")

    storage = app.ctx.storage
    storage.delete(image_path, None)

    query_embedding = query_embed[0]["embedding"]

    query_embedding_np = np.array(query_embedding, dtype=np.float32)
    # print(type(query_embedding_np))
    distances, indices = index.search(query_embedding_np.reshape(1, -1), k=index.ntotal)

    neighbors_with_distances = list(zip(distances[0], indices[0]))

    sorted_neighbors = sorted(neighbors_with_distances, key=lambda x: x[0])

    # sorted_distances = [distance for distance, _ in sorted_neighbors]

    # sorted_indices = [index for _, index in sorted_neighbors]

    images = []
    # distances = []

    # print(sorted_indices)

    for distance, index in sorted_neighbors:
        # if distance <= 27.79:
        image = temp_embeds[index].image_url
        if image not in images:
            images.append(image)

    end_time = time.time()

    return json(
        {
            "images": images,
            "execution_time": str(end_time - start_time),
            # "similarity": json(sorted_distances),
        }
    )


@app.get("/api/getEvents")
async def get_events(request: Request) -> HTTPResponse:
    # input_args = request.json
    # if input_args is None:
    #     return {"message": "empty input set passed"}

    # event_slug = input_args.get("event_slug")

    # if event_slug is None:
    #     return json({"message": "please provide event slug"})

    db = app.ctx.db

    events = await db.event.find_many()

    serialized_events = [
        {"id": event.id, "name": event.name, "slug": event.slug} for event in events
    ]

    # for event in events:
    #     event.createdAt = event.createdAt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    #     event.updatedAt = event.updatedAt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    print(type(serialized_events))

    return json(serialized_events)


@app.post("/api/getSingleEvent")
async def get_event_data(request: Request) -> HTTPResponse:
    input_args = request.json
    if input_args is None:
        return {"message": "empty input set passed"}

    event_slug = input_args.get("event_slug")

    print("event_slug", event_slug)

    if event_slug is None:
        return json({"message": "please provide event slug"})

    db = app.ctx.db

    event = await db.event.find_first(where={"slug": event_slug})

    return json(
        {
            "id": event.id,
            "name": event.name,
            "slug": event.slug,
            "city": event.city,
            "featuredImageURL": event.featuredImageURL,
            "date": event.date,
        }
    )
