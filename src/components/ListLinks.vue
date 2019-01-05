<template>
  <div class="link-lists">
    <div :key="link.key" v-for="link in links">
      <LinkItem :item="link" :existingTags="existingTags" />
    </div>
  </div>
</template>

<script>

import LinkItem from '@/components/LinkItem.vue';

export default {
  name: 'ListLinks',

  components: {
    LinkItem,
  },

  props: {
    links: Array,
  },

  computed: {
    existingTags() {
      return this.$store.state.allTags;
    },
  },

  methods: {
    removeLink(id) {
      return this.$store.dispatch('removeLink', id);
    },
  }
}
</script>

<style>
.link-lists {
  padding: 4em 0;
  /* border-top: 1px solid rgba(0, 0, 0, 0.5); */
}
</style>

