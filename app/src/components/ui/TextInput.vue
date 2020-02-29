<template>
<label :for="$attrs.name">
  <slot name="label" />
  <div class="text-input">
    <span class="icon">
      <slot name="icon" />
    </span>
    <input
      type="text"
      :name="$attrs.name"
      v-on="listeners"
      v-on:keyup.enter="$emit('submit', value)"
      @focus="$event.target.select()"
      :value="value"
    />
    <span class="icon--trailing">
      <slot name="trailing" />
    </span>
  </div>
</label>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    listeners() {
      return { ...this.$listeners, input: this.onInput };
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="postcss" scoped>
input[type="text"] {
  @apply w-full bg-transparent truncate overflow-hidden 
  /* cursor-default */
}

input[type="text"]::selection {
  @apply bg-blue-700
}

.text-input {
  transition: 0.1s all ease;
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  @apply flex justify-start items-center rounded shadow bg-sys-3 text-gray-200 leading-none px-2 text-sm font-medium border border-transparent
}

.icon {
  transition: 0.1s all ease;
  @apply text-sys-1 -ml-1 mr-1
}
.text-input:hover .icon {
  @apply text-blue-200
}

input[type="text"]:focus {
  @apply outline-none cursor-text
}
.text-input:focus-within {
  @apply shadow-outline bg-sys-2 text-white border-sys-1
}

.text-input:focus-within .icon {
  @apply text-blue-400
}

</style>