import city from "./images/city.jpg";
import web from "./pdfs/web.pdf";
const domHandler = () => {
  document.body.style.backgroundImage = `url(${city})`;
  const link = document.createElement("a");
  link.href = web;
  link.innerHTML = "Click to open the PDF";
  document.body.appendChild(link);
};

export default domHandler;
