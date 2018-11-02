# Example-form
### 基于Vue构造器创建Form组件的通用解决方案

<hr/>

> 在前端平常的业务中，无论是官网、展示页还是后台运营系统都离不开表单，它承载了大部分的数据采集工作。所以如何更好地实现它，是平常工作中的一个重要问题。

在应用Vue框架去开发业务时，会将页面上每个独立的可视/可交互区域拆分为一个组件，再通过多个组件的自由组合来组成新的页面。例如

```vue
<template>
  <header></header>
  ...
  <content></content>
  ...
  <footer></footer>
</template>
```

当用户的某个行为页面触发表单时（例如注册、建立内容等），我们会在页面中弹出一个From组件。通常的做法是在`template`中填入一个`<register-form>`组件用于开发注册表单，并通过控制`data`中的`UI.isOpen`来对其`display`进行控制。

```vue
<template>
  <header></header>
  ...
  <content></content>
  ...
  <footer></footer>
  ...
  <register-form v-if="UI.isOpen">
    <form-item></form-item>
    ...
    <submit-button></submit-button>
  </register-form>
</template>
```

这样开发有一点优势，Form组件与原组件可以通过`prop`以及`event`方便通信以及数据传递。但是也会有以下几个缺陷：

- 当前组件的`data`必须要有`UI.isOpen`来控制表单，如果存在多个表单时，就会有大段的代码来维护表单的状态；
- 如果多个`button`触发同一个表单时，可能需要对表单的`data`进行重置；
- 与组件化思想相违背，表单不属于当前页面，它只是由于用户行为触发的结果。

为了解决以上缺陷，并且还能具备方便通信的优势，本文选择用`Vue.extend`将原有`<register-form></register-form>`组件转化为函数，并维护在当前组件的`method`中，当用户触发时，在页面中挂载，关闭时自动注销。

#### 实例：

演示地址：[[http://localhost:3000/blog/juejin-example-1#/]]

代码地址：[[https://github.com/FatGe/example-form]]

- APP组件

```vue
<template>
  <div id="app">
    <el-button 
        type="primary" icon="el-icon-edit-outline"
        @click="handleClick"
    >注册</el-button>
  </div>
</template>

<script>
import register from './components/register'
import { transform } from './transform'

export default {
  name: 'App',
  methods: {
    register: transform(register),

    handleClick () {
      this.register({
        propsData: {
          name: '皮鞋'
        },
        done: name => alert(`${name}牛B`)
      })
    }
  }
}
</script>
```

当APP组件中`<el-button>`的点击事件触发时，调用`register`方法，将表单组件挂载在页面中。 

- Form组件

```vue
<template>
  <div class="mock" v-if="isVisible">

    <div class="form-wrapper">
       <i class="el-icon-close close-btn" @click.stop="close"></i>

       <div class="header">
            ...
       </div>

        <div class="content">
            ...
        </div>

        <div class="footer">
            <el-button 
                type="primary"
                @click="handleClick"
            >确定</el-button>

            <el-button 
                type="primary"
                @click="handleClick"
            >取消</el-button>
        </div>

    </div>
     
  </div>
</template>

<script>
export default {
    
  props: {
    name: { type: String, default: '' }
  },

  data () {
    return {
      isVisible: true
    }
  },
    
  watch: {
    isVisible (newValue) {
      if (!newValue) {
        this.destroyElement()
      }
    }
  },
    
  methods: {
    handleClick ({ type }) {
      const handler = {
        close: () => this.close()
      }
    },
    destroyElement () {
      this.$destroy()
    },
    close () {
      this.isVisible = false
    }
  },
  
  created () {
    // init data
  }
  
  mounted () {
    document.body.appendChild(this.$el)
  },
    
  destroyed () {
    this.$el.parentNode.removeChild(this.$el)
  }
}
</script>
```

两者的通信通过`register`的`options`还完成，并且Form组件中维护了自身的`isVisible` ，当用户点击`close`或者取消时，表单会自动关闭并从页面中移除。

#### 原理：

上述代码中，最为关键的一步就是`transform`函数，它将原有的Form组件从原文的**single-file components**转化为了**method**，其原理如下

```js
const transform = (component) => {
  const _constructor = Vue.extend(component)
  return function (options = {}) {
    const {
      propsData
    } = options
    let instance = new _constructor({
      propsData
    }).$mount(document.createElement('div'))

    return instance
  }
}
```

首先利用Vue的API-`Vue.extend(options)`[https://cn.vuejs.org/v2/api/#Vue-extend]创建一个Form组件的子类

```js
const _constructor = Vue.extend(component)
```

然后`return`一个`function`，它的功能是，在`method`调用时，将组件**实例化**

```js
const {
  propsData
} = options
let instance = new _constructor({
  propsData
}).$mount(document.createElement('div'))
```

为了能够控制实例化后的组件，选择`instance`返回。

当组件实例化时，它只是挂载到`document.createElement('div')`上，但是并没有挂载到页面上，所以需要将其`appendChild`到页面中。为了更好的语义化，选择在组件的生命周期中完成它在页面中的挂载。实例化时，会触发组件`mounted`生命周期，所以当其触发时可以挂载在`document.body`中，具体如下

```js
mounted () {
  document.body.appendChild(this.$el)
}
```

有了挂载，就必须要有注销。对应的生命周期应该是`destroyed`，所以

```js
method: {
  destroyElement () {
    this.$destroy()
  }   
},
destroyed () {
  this.$el.parentNode.removeChild(this.$el)
}
```

组件注销的时间与它在页面中显示息息相关，所以

```js
watch: {
  isVisible (newValue) {
    if (!newValue) {
      this.destroyElement()
      // 如果需要添加过渡动画
      // this.$el.addEventListener('transitionend', this.destroyElement)
    }
  }
}
```

一般Form组件有两个功能：

- done：代表用户确认；
- cancel：代表用户取消；

当done或cancel触发时，APP组件内可能会有相应的变化，所以在组件实例化之后，利用`$on`去监听对应的`done`事件以及`cancel`事件。

```js
done && inlineListen({
  method: 'done',
  options,
  instance
})
cancel && inlineListen({
  method: 'cancel',
  options,
  instance
})
```

其中`inlineListen`函数可以方便后续添加其他的`event`，其代码为

```js
const inlineListen = ({
  method,
  options,
  instance
}) => {
  let listener = `on${method}`
  instance[listener] = options[method]
  instance.$on(method, function (data) {
    this[listener](data)
  })
}
```

以上是解决Form组件的原理以及方案。

##### 使用：

可以将上述属于Form组件公有的`data`以及`method`独立出来，再通过`mixins`引入到每个表单内，例如

```js
export default {
  data() {
    return {
      visible: true
    }
  },
  watch: {
    visible(newValue) {
      if (!newValue) {
        this.destroyElement()
      }
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  destroyed() {
    this.$el.parentNode.removeChild(this.$el)
  },
  methods: {
    destroyElement() {
      this.$destroy()
    },
    close() {
      this.visible = false
    }
  }
}
```

再通过`mixins`混入。

```js
<script>
import popupWin from '../mixins/popup-win'

export default {
  mixins: [popupWin],

  data () {
    return {
      input: '',
      gender: 1
    }
  },
  methods: {
    handleClick ({ type }) {
      const handler = {
        close: () => this.close()
      }
    }
  }
}
</script>
```

##### 总结：

通过上述的`transform`函数，将原有的注入式组件转化为了命令式，简化了页面状态的维护，在通过`mixins`混入公有`data`以及`method`，简化了表单组件开发。上述方法也可用于开发toast、alert、confirm等组件，只需要将`Vue.prototype = transform(Toast-Component)`。

> 原创声明： 该文章为原创文章，转载请注明出处。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
