import cloudinary

def upload_temporary_image(file):
    try:
        result = cloudinary.uploader.upload(file, upload_preset="chat")
        return result['secure_url']
    except Exception as e:
        print("Error uploading image:", e)
        return None