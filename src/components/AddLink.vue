<template>
  <div class="link-form">
    <div class="lf-input">
      <div class="lf-input-item">
        <label for="lf-name"> Name </label>
        <input id="lf-name" type="text" v-model="name" :class="{ hasError: namev !== true }" />
      </div>
      <p class="lf-error"> {{ namev === true ? '&nbsp;' : namev }} </p>
    </div>
    <div class="lf-input">
      <div class="lf-input-item">
        <label for="lf-url"> URL </label>
        <input id="lf-url" type="text" v-model="url" :class="{ hasError: urlv !== true }" />
      </div>
      <p class="lf-error"> {{ urlv === true ? '&nbsp;' : urlv }} </p>
    </div>
    <div class="lf-input">
      <div class="lf-input-item">
        <label for="lf-desc"> Description </label>
        <textarea id="lf-desc" v-model="desc" :class="{ hasError: descv !== true }" />
      </div>
      <p class="lf-error"> {{ descv === true ? '&nbsp;' : descv }} </p>
    </div>
    <div class="lf-tag-input">
      <tags-input
        :element-id="`add-link-tags`"
        v-model="tags"
        :existingTags="existingTags"
        :typeahead="true"
        typeahead-style="dropdown"
        placeholder="Add Tags"
        :add-tags-on-comma="true"
      />
    </div>
    <button @click="saveLink" :disabled="this.status === 'saving'">
      Save
    </button>
  </div>
</template>

<script>

import TagsInput from '@voerro/vue-tagsinput';

function isValidURL(string) {
  const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null) {
    return 'Not a valid URL';
  }
  return true;
}

function isValidString(string) {
  if (!string || !string.length) {
    return `Can't be empty`;
  }
  return true;
}

function allTrue(obj, keys) {
  return keys.reduce((acc, key) => {
    return acc && (obj[key] === true);
  }, true);
}

export default {
  name: 'AddLink',

  components: {
    TagsInput,
  },

  data() {
    return {
      status: 'empty',
      name: '',
      desc: '',
      url: '',
      tags: [],
    };
  },

  computed: {
    validated() {
      return allTrue(this, ['namev', 'descv', 'urlv']);
    },

    existingTags() {
      console.log(this.$store.state.allTags);
      return this.$store.state.allTags;
    },

    namev() {
      return isValidString(this.name);
    },

    descv() {
      return isValidString(this.desc);
    },

    urlv() {
      const isValid = isValidURL(this.url);
      if (isValid !== true) {
        return isValid;
      }

      if (this.$store.getters.isUrlPresent(this.url) === true) {
        return 'Already saved';
      }

      return true;
    },
  },

  methods: {
    saveLink() {
      this.status === 'saving';
      this.$store.dispatch('addLink', {
        name: this.name,
        desc: this.desc,
        url: this.url,
        tags: this.tags,
      }).then(() => {
        this.status = 'empty';
        this.name = '';
        this.desc = '';
        this.url = '';
        this.tags = [];
      }).catch(ex => {
        this.status = 'errored';
      });
    },
  }
};
</script>


<style>
.link-form {
  padding-top: 2em;
}

.link-form .lf-input {
  margin: 1em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0;
}

.link-form .lf-input .lf-input-item {
  display: flex;
  justify-content: center;
}

.link-form .lf-input .lf-input-item label {
  font-family: 'Slabo 27px', serif;
  font-size: 1.2em;
}

.link-form .lf-input .lf-input-item input, .link-form .lf-input .lf-input-item textarea {
  font-family: 'IBM Plex Mono', monospace;
  border: none;
  margin-left: 1em;
  font-size: 1em;
  flex-grow: 0.9;
  border-bottom: 1px dashed #AAA;
}

.link-form .lf-input .lf-input-item input.hasError, .link-form .lf-input .lf-input-item textarea.hasError {
  border-bottom: 1px dashed rgba(200, 50, 50, 0.3);
  color: red;
}

.link-form .lf-input .lf-input-item input:focus, .link-form .lf-input .lf-input-item textarea:focus {
  border-bottom: 1px solid black;
  box-shadow: none;
  outline: none;
}

.link-form .lf-input p.lf-error {
  margin: 0;
  text-align: right;
  font-family: 'IBM Plex Mono', monospace;
  color: #C66;
  font-size: 0.8em;
  margin-right: 5em;
}

.link-form .lf-tag-input {
  margin: 0 3em;
}

.link-form button {
  border: none;
  background: black;
  color: white;
  padding: 0.5em;
  float: right;
  margin-top: 1em;
  margin-right: 5em;
}

</style>
