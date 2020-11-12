class ShopMailer < ApplicationMailer

  def send_email
    # @user = params[:user]
    # @url  = 'http://example.com/login'
    mail(to: 'jonathanahernnyc@gmail.com', subject: 'Help Me')
  end

end
