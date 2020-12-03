var url = window.location.href;
var shop = Shopify.shop;
var pickedProducts = getPicks();
var prodID = null;
var pickAlreadyFound = false;
var collectionEles = [];
var recheckTime = 300;

if (url.includes('/products/')) {
  prodID = meta.product.id;
  setPicks(shop);
}

if (url.includes("/collections/") && !(url.includes('/products/'))) {
  setPicks(shop);
  loadInStickers();
}

// PAGE CODE //

if (url.includes("/pages/")) {

    const eles = document.getElementsByClassName("staff-picks-products");

    if (eles.length > 0){
        let staffid = eles[0].dataset.staffid.toString();
        fetch(`https://staff-picks-app.herokuapp.com/api/pages?employeeid=${staffid}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((resp) => {
            createProducts(eles[0], Object.values(resp));
          });
    } else {
      const staffEle = document.getElementById("staff-profiles-ele");
      if (staffEle){ 
        fetch(`https://staff-picks-app.herokuapp.com/api/pages/1/getStaff?shopDom=${shop}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((resp) => {
            createStaff(staffEle, resp);
          });
      }
    }
}

function createStaff(staffContainer,staffArr){
  staffArr.forEach((staff) => {

    let memberLink = document.createElement("a");
    memberLink.href = url.split("/pages/")[0] + "/pages/" + staff.page_url;
    memberLink.className += "staff-member-container";
    memberLink.style.marginBottom = "12px";
    staffContainer.appendChild(memberLink);

    let containerImg = document.createElement("div");
    containerImg.className += "staff-img-container";
    memberLink.appendChild(containerImg);

    let img = document.createElement("img");
    img.src = staff.profile_url;
    containerImg.appendChild(img);

    let name = document.createElement("h4");
    name.innerHTML = staff.name;
    memberLink.appendChild(name);

    let job_title = document.createElement("p");
    job_title.className += "job-title";
    job_title.innerHTML = staff.job_title;
    memberLink.appendChild(job_title);

    let description = document.createElement("p");
    description.className += "description-staff-pick";
    let descriptionEdit = staff.description;
    if (descriptionEdit.length > 300) {
      descriptionEdit = descriptionEdit.substr(0, 300) + "...";
    }
    description.innerHTML = descriptionEdit.replace(/\n/g, "<br />");
    memberLink.appendChild(description);

  });
}

function createProducts(container, data) {
    
    data.forEach((pick) => {

        let containerPick = document.createElement("a");
        containerPick.href = url.split("/pages/")[0] + "/products/" + pick.shopify_handle;
        containerPick.className += "pick-container";
        containerPick.style.marginBottom = "12px";
        container.appendChild(containerPick);

        let containerImg = document.createElement("div");
        containerImg.className += "img-container-staff";
        containerPick.appendChild(containerImg);

        let img = document.createElement("img");
        img.src = pick.shopify_image_url;
        containerImg.appendChild(img);
    
        let title = document.createElement("h4");
        title.innerHTML = pick.shopify_title;
        containerPick.appendChild(title); 
    
        let description = document.createElement("p");
        description.innerHTML = pick.review.replace(/\n/g, "<br />");
        containerPick.appendChild(description);

    });
    
}


// COLLECTIONS PAGE CODE //
function loadInStickers(){
    const settings = localStorage.getItem("staffPicksSettings");
    let sticker = settings == null ? null : JSON.parse(settings)["sticker"];
    const eles = document.getElementsByClassName("staff-pick-alert");
    if (pickedProducts !== null && sticker !== "none"){
      for (var i = 0; i < eles.length; i++) {
          let ele = eles[i];
          let idCheck = parseInt(ele.dataset.prodid);
          if (pickedProducts.includes(idCheck)){
              collectionEles.push(ele);
              insertPickPic(ele);
              if (!pickAlreadyFound){
                  setupPageForCollections();
              }
          }
      }
    }
}

function insertPickPic(ele) {
  
  let container = document.createElement("div");
  container.className = "starburst-container";
  container.style.margin = "2px";
  ele.appendChild(container);

  let circle = document.createElement("img");
  circle.className = "sticker-img";
  circle.src = loadStickerImage();
  
  container.appendChild(circle);

  let text = document.createElement("p");
  text.innerHTML = "STAFF<br/>PICK!";
  text.className = "staff-pick-lettering";
  
  container.appendChild(text);
}

function loadStickerImage(){
  let settings = JSON.parse(localStorage.getItem("staffPicksSettings"));

    switch (settings["sticker"]) {
      case "red":
        return "https://i.ibb.co/3kW5XsV/red-burst.png";
      case "blue":
        return "https://i.ibb.co/JRgFHfL/blue-burst.png";
      case "yellow":
        return "https://i.ibb.co/HXqddbd/yellow-burst.png";
      case "green":
        return "https://i.ibb.co/cxqQbg9/green-burst.png";
      case "purple":
        return "https://i.ibb.co/cC3Ry3v/purple-burst.png";
      default:
        return "https://i.ibb.co/3kW5XsV/red-burst.png";
    }
}

function setupPageForCollections() {
  var style = document.createElement("style");
  pickAlreadyFound = true;
  style.innerHTML =
    ".starburst-container {" +
        "position: absolute;" +
        "top: 0px;" +
        "right: 0px;" +
        "width: 58px;" +
    "}" +
    ".staff-pick-alert p {" +
        "position: absolute;" +
        "transform: translate(50%, -50%);" +
        "top: 45%;" +
        "right: 50%;" +
        "color: white;" +
        "text-align: center;" +
        "font-size: .70em;" +
        "line-height: 1.3;" +
    "}" +
    "@media screen and (max-width: 500px) {" +
        ".staff-pick-alert p {" +
            "font-size: .65em;" +
            "right: 48%;" +
        "}" +
        ".starburst-container {" +
          "max-width: 55px;" +
        "}" +
    "}";

  // Get the first script tag
  var ref = document.querySelector("script");

  // Insert our new styles before the first script tag
  ref.parentNode.insertBefore(style, ref);
}



//PRODUCT PAGE CODE//


if (url.includes('/products/') && pickedProducts && pickedProducts.includes(prodID)) {
    setupPageForPick();

  fetch(`https://staff-picks-app.herokuapp.com/api/front_end/show?shop=${shop}&prodID=${meta.product.id}`, {
    method: "GET",
    })
  .then(res => res.json())
  .then(resp => {
      insertData(resp);
  })
}

function setPicks (shop) {
  var secondDiff = getTimeDifference();
  if (secondDiff >= recheckTime){
    fetch(`https://staff-picks-app.herokuapp.com/api/front_end?shop=${shop}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((resp) => {
          populateLocalStorage(resp);
        });
  }
}

function populateLocalStorage(data){
    var startDate = new Date();
    localStorage.setItem('updateTime-sp', JSON.stringify(startDate.getTime()));
    const origProducts = getPicks();
    const origSettings = localStorage.getItem("staffPicksSettings");
    localStorage.setItem("pickedProducts", JSON.stringify(data["ids"]));

    localStorage.setItem("staffPicksSettings", JSON.stringify(data["settings"]));

    let oldSticker = origSettings == null ? "nothing" : JSON.parse(origSettings)["sticker"]

    if (data["settings"]["sticker"] !== oldSticker){
      pickedProducts = getPicks();
      if (oldSticker === "nothing"){
      loadInStickers();
      } else {
        let eles = document.getElementsByClassName("sticker-img");
        for (let i = 0; i < eles.length; i++) {
          eles[i].src = loadStickerImage();
        }
      }
    }
    
    if(origProducts!=null){
      checkForProductChanges(origProducts, data)
    }    
}

function checkForProductChanges(origProducts, data){
  if(origProducts.length > data["ids"].length){
          let idsToDelete = origProducts.filter((x) => !data["ids"].includes(x));
          for (var j = 0; j < collectionEles.length; j++) {
              let ele = collectionEles[j];
              let idCheck = parseInt(ele.dataset.prodid);
              if (idsToDelete.includes(idCheck)) {
                  ele.innerHTML = "";
              }
          }
      } else if (origProducts.length < data["ids"].length) {
          let idsToAdd = data["ids"].filter((x) => !origProducts.includes(x));
          let eles = document.getElementsByClassName("staff-pick-alert");
          for (var e = 0; e < eles.length; e++) {
            let ele = eles[e];
            let idCheck = parseInt(ele.dataset.prodid);
            if (idsToAdd.includes(idCheck)) {
              collectionEles.push(ele);
              insertPickPic(ele);
              if (!pickAlreadyFound){
                  setupPageForCollections();
              }
            }
          }
      }
}

function getPicks (){
  let data=localStorage.getItem('pickedProducts');
  if (data == null) {
      return null
  } else {
      let newData = JSON.parse(data)
      return Object.values(newData)
  }
}

function getTimeDifference(){
  let updateTime = localStorage.getItem('updateTime-sp');
  if (updateTime == null){
    var startDate = new Date();
    localStorage.setItem('updateTime-sp', JSON.stringify(startDate.getTime()));
    return recheckTime;
  } else {
    oldTime = JSON.parse(updateTime);
    newTime = new Date();
    var seconds = (newTime.getTime()-oldTime) / 1000;
    return Math.abs(seconds);
  }
}

function setupPageForPick(){
  let settings = JSON.parse(localStorage.getItem("staffPicksSettings"));

  switch (settings["layout"]) {
    case "side-col":
      setupPageForSideCol();
      break;
    case "bottom-page":
      setupPageForBottomPage();
      break;
    case "inside-col":
      setupPageForInsideCol();
      break;
    default:
      break;
  }
}

function setupPageForSideCol() {
    var style = document.createElement('style');
    style.innerHTML =
        '#main-content-sp {' +
            'width: 80%;' +
        '}' +
        '#full-container-sp {' +
            'display: flex;' +
        '}' +
        '#staff-pick-ele {' +
            'width: 20%;' +
            'margin-left: 20px;' +
        '}' +
        '#staff-pick-ele p{' +
            'margin-bottom: 0px;' +
        '}' +
        '@media screen and (max-width: 750px) {'+
            '#full-container-sp {' +
                'display: block;' +
            '}' +
            '#staff-pick-ele {' +
              'width: 80%;' +
              'margin: 20px auto;' +
              'margin-bottom: 80px;' +
            '}' +
            '#staff-pick-ele img{' +
              'width: 160px;' +
              'float: left;' +
              'margin-right: 10px;' +
            '}' +
            '#staff-pick-ele img:: after {' +
              'content: "";' +
              'clear: both;' +
              'display: table;' +
            '}' +
            '#staff-pick-ele p{' +
              'margin-bottom: 0px;' +
            '}';

    // Get the first script tag
    var ref = document.querySelector('script');
    // Insert our new styles before the first script tag
    ref.parentNode.insertBefore(style, ref);
}

function setupPageForBottomPage() {

    var style = document.createElement('style');
    style.innerHTML =
        '#staff-pick-ele {' +
            'width: 80%;' +
            'margin: 20px auto;' +
        '}' +
        '#staff-pick-ele img{' +
            'width: 160px;' +
            'float: left;' +
            'margin-right: 10px;' +
            'margin-bottom: 10px;' +
        '}' +
        '#staff-pick-ele img:: after {' +
          'content: "";' +
          'clear: both;' +
          'display: table;' +
        '}' +
        '#staff-pick-ele p{' +
            'margin-bottom: 0px;' +
        '}';

    // Get the first script tag
    var ref = document.querySelector('script');
    // Insert our new styles before the first script tag
    ref.parentNode.insertBefore(style, ref);
}

function setupPageForInsideCol() {

  var style = document.createElement('style');
  style.innerHTML =
    '#staff-pick-ele {' +
      'margin-top: 16px;' +
    '}' +
    '#staff-pick-ele img{' +
      'width: 170px;' +
      'float: left;' +
      'margin-right: 10px;' +
    '}' +
    '#staff-pick-ele img:: after {' +
      'content: "";' +
      'clear: both;' +
      'display: table;' +
    '}' +
      '#staff-pick-ele p{' +
      'margin-bottom: 0px;' +
    '}';

  // Get the first script tag
  var ref = document.querySelector('script');
  // Insert our new styles before the first script tag
  ref.parentNode.insertBefore(style, ref);
}

function insertData(data){
    const staffPick = document.getElementById(`staff-pick-ele`);

    let staffA = document.createElement("a");
    staffA.href = `/pages/${data["employee"]["page_url"]}`;
    staffA.target = "_blank";
    staffPick.appendChild(staffA);

    let img = document.createElement("img");
    img.src = data["employee"]["profile_url"];
    staffA.appendChild(img);

    const wordsDiv = document.createElement("div");
    staffA.appendChild(wordsDiv);

    let pDescription = document.createElement("p");
    pDescription.innerHTML = data["pick"]["review"].replace(/\n/g, "<br />");
    pDescription.style.margin = "0px";
    pDescription.style.marginBottom = "12px";
    wordsDiv.appendChild(pDescription);

    let pName = document.createElement("p");
    let nameString = `${data["employee"]["name"]}`;
    pName.style.fontWeight = "900";
    pName.innerHTML = nameString;
    wordsDiv.appendChild(pName);

    let jobTitleString = `${data["employee"]["job_title"]}`;

    if (jobTitleString.length > 0){
        let pJobtitle = document.createElement("p");
        pJobtitle.innerHTML = jobTitleString;
        wordsDiv.appendChild(pJobtitle);
    }

}