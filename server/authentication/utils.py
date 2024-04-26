from django.core.mail import EmailMessage
import random
from django.conf import settings
from .models import User, UserVerification, PasswordReset
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.utils import timezone
from utils.responses import SuccessResponse, ErrorResponse



def send_generated_otp_to_email(email, request): 
    subject = "One time passcode for Email verification"
    otp=random.randint(100000, 999999) 
    current_site=get_current_site(request).domain
    user = User.objects.get(email=email)
    email_body=f"Hi {user.first_name} thanks for signing up on {current_site} please verify your email with the \n one time passcode {otp}"
    from_email=settings.EMAIL_HOST
    UserVerification.objects.create(user=user, otp=otp)
    #send the email 
    d_email=EmailMessage(subject=subject, body=email_body, from_email=from_email, to=[user.email])
    d_email.send()

def send_generated_url_change_pass_to_email(email): 
    user = User.objects.get(email=email)
    PasswordReset.objects.filter(created_at__lte=timezone.now() - timezone.timedelta(minutes=5)).delete()
    check_send = PasswordReset.objects.filter(email=email).exists()
    if check_send:
        return SuccessResponse(data={
        "message": "Send mail successfully. Please check your meail to change your password",
        "email": user.email
    })
    token = get_random_string(40)
    url = f"http://localhost:3001/auth/change-password/token={token}"
    clickable_text = f"""
    <div style="font-family: Helvetica, Arial, sans-serif; min-width: 500px; overflow: auto; line-height: 2">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
            <div style="border-bottom: 1px solid #eee">
                <a href="#" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">ChatApp Training Support</a>
            </div>
            <p style="font-size: 1.1em; color: #000;">Hello,</p>
            <p style="color: #000">Thank you for choosing ChatApp. Use the link below to complete your password reset process. The link is valid for 5 minutes.</p>
            <a href="{url}" style="margin: 0 auto; width: max-content; padding: 0 10px; border-radius: 4px; display:block;">Click here</a>
            <div style="float: right; padding: 8px 0; color: #000; font-size: 0.8em; line-height: 1; font-weight: 300">
                <p>ChatApp</p>
                <p>Vietnam</p>
            </div>
        </div>
    </div>
    """
    email_body = clickable_text
    email = EmailMessage(
        subject='ChatApp - Change password!',
        body=email_body,
        from_email=settings.EMAIL_HOST,
        to=[user.email]
    )
    email.content_subtype = "html"
    try:
        email.send()
    except Exception as e:
        return ErrorResponse(error_message="Error while sending email. Please try again later.")
    PasswordReset.objects.create(email=user.email, token=token)
    return SuccessResponse(data={
        "message": "Send mail successfully. Please check your meail to change your password",
        "email": user.email
    })

def send_normal_email(data):
    email=EmailMessage(
        subject=data['email_subject'],
        body=data['email_body'],
        from_email=settings.EMAIL_HOST_USER,
        to=[data['to_email']]
    )
    email.send()