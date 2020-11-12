export const sendEmail = (data) =>
  $.ajax({
    url: `/api/emails`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    method: "post",
    data: { data },
  });