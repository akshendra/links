<template>
  <div class="export">
    <pre>
      {{ JSON.stringify(data, null, 2) }}
    </pre>
  </div>
</template>

<script>
export default {
  name: 'Export',

  computed: {
    data() {
      return this.$store.state.links;
    },
  }
}
</script>

