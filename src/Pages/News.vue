<script setup lang="ts">
import BlogCard from '../Widgets/BlogCard.vue';


</script>

<template>
  <div class="news">
    <BCardGroup columns>
      <BlogCard v-for="iu in 5" :key="iu"/>
      <BCard header="Quote">
        <blockquote class="blockquote mb-0">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante.
          </p>
          <footer class="blockquote-footer">
            Someone famous in <cite title="Source Title">Source Title</cite>
          </footer>
        </blockquote>
      </BCard>

      <BCard bg-variant="dark" text-variant="white">
        <blockquote class="card-blockquote">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante.
          </p>
          <footer>
            <small>Someone famous in
              <cite title="Source Title">Source Title</cite></small>
          </footer>
        </blockquote>
      </BCard>
    </BCardGroup>
  </div>


  <div class="ns">
    <BCard v-for="n in 8" :key="n" title="Card title that wraps to a new line"
      :img-src="`https://picsum.photos/g/400/100?random=${n}`" img-alt="Image" img-top>
      <BCardText>
        This is a wider card with supporting text below as a natural lead-in
        to additional content. This content is a little bit longer.
      </BCardText>
    </BCard>
  </div>
</template>

<style lang="scss" scoped>
.ns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
