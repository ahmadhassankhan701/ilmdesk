function wrapImagesInContainer(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const images = doc.querySelectorAll("img");

  images.forEach((img) => {
    // Create the wrapper div
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.maxHeight = "400px";
    wrapper.style.overflow = "auto";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";

    // Style the image
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";

    // Replace the image with the wrapper
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
  });

  return doc.body.innerHTML;
}
export { wrapImagesInContainer };
