<template>
  <div class="home">
    <AddLink />
    <ListLinks :links="links" />
  </div>
</template>

<script>

import AddLink from '@/components/AddLink.vue';
import ListLinks from '@/components/ListLinks.vue';

export default {
  name: 'home',

  components: {
    AddLink,
    ListLinks,
  },

  data() {
    return {
      
    };
  },


  computed: {
    links() {
      return this.$store.state.links;
    },
  },
};
</script>
