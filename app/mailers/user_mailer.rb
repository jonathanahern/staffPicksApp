class UserMailer < ApplicationMailer
    default from: 'notifications@example.com'
 
    def welcome_email
        @user = params[:user]
        @url  = 'http://example.com/login'
        mail(to: 'jonathanahernnyc@gmail.com', subject: 'Welcome to My Awesome Site')
    end
end
