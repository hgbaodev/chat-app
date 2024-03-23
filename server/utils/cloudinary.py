import cloudinary

def get_image_url(image):
    # return "https://avatars.githubusercontent.com/u/120194990?v=4"
    if image is None: return None
    try: 
        return cloudinary.api.resource_by_asset_id(image).get('secure_url')
    except Exception as e:
        print(e)
        return None
        
