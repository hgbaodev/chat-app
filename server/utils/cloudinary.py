import cloudinary

def get_image_url(image):
    try: 
        return cloudinary.api.resource_by_asset_id(image).get('secure_url')
    except Exception as e:
        return None
        
