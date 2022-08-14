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
    return price.toFixed(1);
}

const handlingPage = (priceTags) => {
    document.querySelectorAll(priceTags).forEach((price) => {
        if (!price.getAttribute("originalPrice")) {
            price.setAttribute("originalPrice", price.innerText)
            let newPrice = price.cloneNode(true)
            newPrice.innerText = handlingPrice(parseFloat(price.innerText.replace(/[^\d^\.]+/g, '')))
            newPrice.style.display = 'inline-block';
            newPrice.style.padding = "0 0.5em 0 0.5em";
            price.style.display = 'inline-block';
            price.style.textDecoration = 'line-through';
            price.style.color = 'gray';
            price.parentNode.appendChild(newPrice)
        }
    });
}

const shopsList=[
    {
        name:'jd',
        priceTags:`.price-origin span,
        .p-price .price,
        .p-price strong,
        .p-price-fans 
        .price,[class^='J-p-']`
    },{
        name:'taobao',
        priceTags:`.price-value,.price strong,
        #mainsrp-p4pBottom [class$='-price']>:first-child,
        #mainsrp-p4pRight [class$='-price'],
        #J_PromoPriceNum,
        .now-price .price`
    },{
        name:'tmall',
        priceTags:`[class*='Price--'],
        [class*='--price--'],
        .productPrice em,
        a[class$='-price']>:first-child,
        .tm-price,
        p.price>:first-child,
        .c-price,
        .look_price`
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
    handlingPage(matchShopSites.priceTags)
    observer.observe(targetNodeAndConfig.targetNode, targetNodeAndConfig.config);
};

if (matchShopSites) {
    console.log(matchShopSites)
    const observer = new MutationObserver(debounce(callback));
    observer.observe(targetNodeAndConfig.targetNode, targetNodeAndConfig.config);
    handlingPage(matchShopSites.priceTags)
}