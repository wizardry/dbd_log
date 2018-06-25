<template>
  <div class="footerWrap">
    <footer>
      dev by 
      <a href="" target="_blank">@wiz_rein</a>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'app-footer',
  mounted:() => {
    console.log('footer')
  },
};

</script>

<style lang="scss">
body {
  margin: 0;
  position: relative;
  padding-bottom: 20px;
}

.footerWrap {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 20px;
  font-size: 12px;
  background: #616161;
  border-top: 1px solid #666;
  color: #ccc;
  
  footer {
    text-align: right;
    padding: 0 8px;
    
    a {
      color: #ccc;
    }
  }
}
</style>
