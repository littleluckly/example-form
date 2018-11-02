<template>
  <div class="mock" v-if="isVisible">

    <div class="form-wrapper">
       <i class="el-icon-close close-btn" @click.stop="close"></i>

       <div class="header">
           <span>用户注册</span>
           <span></span>
       </div>

        <div class="content">

            <div class="item">
                <div class="item-title">姓名</div>
                <div class="item-content">
                    <el-input v-model="input" placeholder="请输入内容"></el-input>
                </div>
            </div>

            <div class="item">
                <div class="item-title">性别</div>
                <div class="item-content">
                    <el-radio-group v-model="gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div class="footer">
            <el-button 
                type="primary"
                @click="handleClick({ type: 'confirm' })"
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
import popupWin from '../mixins/popup-win'

export default {
  mixins: [popupWin],

  props: {
    name: { type: String, default: '' }
  },

  data () {
    return {
      input: '',
      gender: 1
    }
  },

  methods: {
    handleClick ({ type }) {
      const handler = {
        close: () => this.close(),
        confirm: () => {
          const { name } = this
          this.$emit('done', name)
        }
      }

      handler[type] && handler[type]()
    }
  },

  created () {
    this.input = this.name
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mock {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;

    background: rgba(0, 0, 0, 0.2);
}
.form-wrapper {
    position: relative;

    display: flex;
    flex-direction: column;
    padding: 32px 16px 16px 32px;
    width: 350px;
    height: 300px;

    border-radius: 2px;
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
    background: white;
}
.close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
}

.header,
.content,
.footer {
    margin-bottom: 16px;
}

.header {
    font-size: 16px;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;

    justify-content: space-between;
}

.content .item {
    display: flex;
    align-items: center;

    flex: 1;

    font-size: 14px;
}

.item .item-title {
    margin-right: 12px;
    width: 50px;
}

.item .item-content {
    flex: 1;
}

</style>
