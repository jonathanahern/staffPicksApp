class Email < MailForm::Base
  attribute :name, validate: true
  attribute :email, validate: /\A[^@\s]+@[^@\s]+\z/i
  attribute :shop_name, validate: true
  attribute :message, validate: true

  # Declare the e-mail headers. It accepts anything the mail method
  # in ActionMailer accepts.
  def headers
    {
      subject: "Help with Staff Picks",
      to: "staffpicksapp@gmail.com",
      from: %("#{name}" <#{email}>)
    }
  end
end


