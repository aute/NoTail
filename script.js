const debounce = (func, wait = 100) => {
    let timer = 0
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}

const handlingPrice = (price) => {
    price = Math.ceil(price)
    if (price >= 8 && price < 10) {
        price = 10
    } else {
        let l = 0
        while (price >= 9.5) {
            if (price % 10 >= 9) {
                price = Math.floor(price + 1)
            } else if (price % 10 >= 8) {
                price = Math.floor(price + 2)
            }
            price = price / 10
            l++
        }
        price = price * Math.pow(10, l)
    }
    return price;
}

const shopsList=[
    {
        name:'jd',
        PriceTags:`.price-origin span,.p-price .price,.p-price strong,.p-price-fans .price,[class^='J-p-']`
    },{
        name:'taobao',
        PriceTags:`.price-value,.price strong,[class$='-price']:first-child`
    },{
        name:'tmall',
        PriceTags:`[class*='Price--'],[class*='--price--'],.productPrice em,[class$='-price']:first-child`
    }]

const matchShopSites = shopsList.find(element => {
    const shopsRegExp = new RegExp(`.${element.name}.`, 'i')
    return window.location.origin.match(shopsRegExp)
})


const targetNodeAndConfig = {
    targetNode: document.querySelector('body'),
    config: { childList: true, subtree: true }
};


const callback = function (mutationsList, observer) {
    observer.disconnect()
    document.querySelectorAll(matchShopSites.PriceTags).forEach((price) => {
            if (!price.getAttribute("originalPrice")) {
                price.setAttribute("originalPrice", price.innerText)
                let newPrice = price.cloneNode(true)
                console.log(handlingPrice(price.innerText.replace(/[^\d^\.]+/g, '')));
                newPrice.innerText = handlingPrice(price.innerText.replace(/[^\d^\.]+/g, ''))
                newPrice.style.display = 'inline-block';
                price.style.display = 'inline-block';
                price.style.textDecoration = 'line-through';
                price.parentNode.appendChild(newPrice)
            }
        });
    observer.observe(targetNodeAndConfig.targetNode, targetNodeAndConfig.config);
};

if (matchShopSites) {
    console.log(matchShopSites)
    const observer = new MutationObserver(debounce(callback));
    observer.observe(targetNodeAndConfig.targetNode, targetNodeAndConfig.config);
}