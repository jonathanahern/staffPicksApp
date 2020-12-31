export const fetchSetting = (shopId) => {
  return $.ajax({
    url: `api/settings/${shopId}`,
    method: "GET",
  });
};

export const updateSetting = (setting) =>
  $.ajax({
    url: `/api/settings/1`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    method: "patch",
    data: { setting },
  });

export const createStaffPage = (pageData) =>
  $.ajax({
    url: `/api/settings`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    method: "post",
    data: { pageData },
  });

export const insertStickers = (auto) =>
  $.ajax({
    url: `/api/settings/1/insertStickers`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    method: "post",
    data: { auto },
  });

export const clearStickers = () =>
  $.ajax({
    url: `/api/settings/1/clearStickers`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    method: "delete",
    data: {},
  });

export const insertLayout = (layout) =>
  $.ajax({
    url: `/api/settings/1/insertLayout`,
    headers: {
      "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content"),
    },
    method: "post",
    data: { layout },
  });

  