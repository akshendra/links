<template>
  <div class="link-item">
    <a class="link-name" :href="item.url" target="_blank"> {{ item.name }} </a>
    <span class="link-desc">
      {{ item.desc }}
    </span>
    <button class="link-remove" @click="removeLink">
      <eva-icon name="close-outline" width="16px" height="16px" animation="pulse" fill="#C66"></eva-icon>
    </button>
    <button class="link-edit" @click="editLink">
      <eva-icon name="edit-2-outline" width="16px" height="16px" animation="pulse" fill="#66C"></eva-icon>
    </button>
    <p class="link-tags">
      <tags-input
        wrapper-class="link-item-tags-input"
        :element-id="`add-link-tags`"
        v-model="tags"
        :existingTags="existingTags"
        :typeahead="true"
        typeahead-style="dropdown"
        placeholder="Add Tags"
        :add-tags-on-comma="true"
        @tags-updated="onUpdateTags"
      />
    </p>
  </div>
</template>


<script>

import TagsInput from '@voerro/vue-tagsinput';

export default {
  name: 'LinkItem',

  components: {
    TagsInput,
  },

  props: {
    item: Object,
    existingTags: Object,
  },

  data() {
    return {
      tags: [],
    };
  },

  methods: {
    setTags() {
      this.tags = this.item.tags;
    },

    onUpdateTags() {
      if (this.item.tags.length !== this.tags.length) {
        const newLink = Object.assign({}, this.item, {
          tags: this.tags,
        });
        this.$store.dispatch('updateLink', newLink);
      } else {
        console.log('Noting changed');
      }
    },

    removeLink() {
      return this.$store.dispatch('removeLink', this.item.key);
    },
    editLink() {

    },
  },

  mounted() {
    this.setTags();
  },
}
</script>

<style>

.link-item {
  margin: 1em 2em;
  margin-top: 2em;
}

.link-item .link-name {
  font-size: 1.4em;
  color: black;
  font-weight: 700;
  font-family: 'Slabo 27px', serif;
  margin-right: 1em;
}

.link-item .link-desc {
  font-size: 0.8em;
  color: black;
  font-family: 'IBM Plex Mono', monospace;
}

.link-item button {
  float: right;
  background: none;
  border: none;
  padding: none;
  /* font-size: 0.5em; */
}


.link-item .link-tags {
  margin-top: 0.2em;
  font-size: 0.8em;
  font-family: 'IBM Plex Mono', monospace;
}

.link-item-tags-input input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

</style>
