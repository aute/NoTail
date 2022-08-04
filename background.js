chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  changeInfo.status === "complete" && chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: setPrice,
  });
})

function setPrice() {

  const debounce = (func, wait = 100) => {
    let timer = 0
    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, wait)
    }
  }
  
  const HandlingPrice = (price) => {
    price = Math.ceil(price)
    let l = 0
    while (price > 1) {
      if (price % 10 === 9) {
        price = price + 1
      } else if (price % 10 === 8) {
        price = price + 2
      }
      price = price / 10
      l++
    }
    while (l > 0) {
      price = price * 10
      l--
    }
    return price;
  }

  const targetNode = document.querySelector('body');

  const config = { childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    observer.disconnect()
    document.querySelectorAll("i[data-price]").forEach((price) => {
      if (!price.getAttribute("originalPrice")) {
        price.setAttribute("originalPrice", price.innerText)
        price.innerText = HandlingPrice(price.innerText)
      }
    });
    observer.observe(targetNode, config);
  };

  const observer = new MutationObserver(debounce(callback));

  observer.observe(targetNode, config);

}