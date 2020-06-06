Vue.component('price', {
    props: {
        value    : Number,
        prefix   : {
            type    : String,
            default : '$'
        },
        precision: {
            type    : Number,
            default : 2
        }
    },
    template: `
        <span>
            {{ this.prefix + Number.parseFloat(this.value).toFixed(this.precision) }}
        </span>`
});

Vue.component('product-list', {
    props   : ['products', 'max', 'imgLayout'],
    methods : {
        before: function(el) {
            el.className = 'd-none'
        },
        enter: function(el) {
            var delay = el.dataset.index * 100
            setTimeout(function () {
                el.className = 'row mb-3 d-flex align-items-center animate__animated animate__fadeInLeft animate__fast'
            }, delay)
        },
        leave: function(el) {
            var delay = el.dataset.index * 100
            setTimeout(function () {
                el.className = 'row mb-3 d-flex align-items-center animate__animated animate__fadeOutRight animate__fast'
            }, delay)
        }
    },
    template: `
        <transition-group name="fade" tag="div" @beforeEnter="before" @enter="enter" @leave="leave">
            <div class="row mb-3 d-none align-items-center" v-for="(item, index) in products" :key="item.id"
                v-if="item.price <= Number(max)" :data-index="index">

                <div class="col-1 m-auto">
                    <button class="btn btn-info" @click="$emit('add', item)">+</button>  
                </div>

                <div class="col-sm-4">
                    <img class="img-fluid" v-bind="{
                        src : item.image,
                        alt : item.name
                    }">
                </div>

                <div class="col m-auto">
                    <h3 class="text-info">
                        {{ item.name }}
                    </h3>
                    <p class="mb-0"> 
                        {{ item.description }} 
                    </p>
                    <div class="h5 float-right">
                        <price :value="Number(item.price)"></price>
                    </div>
                </div>
            </div>
        </transition-group>`
});

var app = new Vue ({
    el   : '#app',
    data : {
        max      : 50,
        products : null,
        cart     : [],
        style    : {
            label       : ['font-weight-bold', 'mr-2'],
            inputWidth  : 60,
            sliderStatus: false
        }
    },
    mounted: function() {
        fetch('https://hplussport.com/api/products/order/price')
        .then(response => response.json())
        .then(data => {
            this.products = data;
        });
    },
    filters: {
        currencyFormat: function (value) {
            return '$' + Number.parseFloat(value).toFixed(2)
        }
    },
    computed: {
        sliderState: function() {
            return this.style.sliderStatus ? 'd-flex' : 'd-none'
        },
        cartTotal: function () {
            let sum = 0
            for (key in this.cart) {
                sum = sum + (this.cart[key].product.price * this.cart[key].qty)
            }
            return sum
        },
        cartQty: function () {
            let qty = 0
            for (key in this.cart) {
                qty = qty + this.cart[key].qty
            }
            return qty
        }
    },
    methods: {
        addItem: function(product) {                                 
            var productIndex                        
            var productExist = this.cart.filter(function (item, index) {
                if (item.product.id == Number(product.id)) {
                    productIndex = index
                    return true
                } else {
                    return false
                }
            });
            if (productExist.length) {
                this.cart[productIndex].qty++
            } else {
                this.cart.push({product: product, qty: 1})
            } 
        },
        deleteItem: function (key) {
            if (this.cart[key].qty > 1) {
                this.cart[key].qty--
            } else {
                this.cart.splice(key, 1)
            }
        }
    }
});