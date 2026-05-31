<template>
  <div
    v-if="pages > 1"
    class="pagination-container"
  >
    <div class="pagination">
      <template v-for="page in pages">
        <div
          v-if="showPage(page)"
          :key="`page-${page}`"
          :class="['page', currentPage === page ? 'active' : '']"
          @click="changePage(page)"
          @keydown="changePage(page)"
        >
          {{ page }}
        </div>
        <div
          v-if="showOffset(page)"
          :key="`offset page-${page}`"
          class="page-offset"
        >
          ...
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  itemsTotal: Number,
  itemsPerPage: Number,
  maxPagesVisible: Number,
  currentPage: Number,
});

const emit = defineEmits(['update:pagination']);

const pages = computed(() => Math.ceil(props.itemsTotal / props.itemsPerPage));

const getMaxPages = computed(() => (props.maxPagesVisible ? props.maxPagesVisible : 3));

const maxPagesRange = computed(() => {
  const pagesRange = [props.currentPage];
  for (let pageNb = 1; pageNb < getMaxPages.value; pageNb += 1) {
    pagesRange.push(props.currentPage - pageNb, props.currentPage + pageNb);
  }
  return pagesRange;
});

const changePage = (page) => {
  emit('update:pagination', page);
};

const showPage = (page) => page === 1
  || page === pages.value
  || maxPagesRange.value.includes(page);

const showOffset = (page) => (((page > 1 && page < pages.value)
  && ((page === props.currentPage - getMaxPages.value)
  && (props.currentPage > getMaxPages.value)))
  || ((page === props.currentPage + getMaxPages.value)
  && (props.currentPage < pages.value - getMaxPages.value)));
</script>

<style lang="scss">
.pagination-container {
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 0;
    margin-top: 24px;
    .pagination {
        display: flex;
        align-items: center;
        .page, .page-offset {
            padding: 8px;
            min-width: 38px;
            text-align: center;
        }
        .page {
            opacity: 0.7;
            cursor: pointer;
            transition: 0.5s ease;
            border-radius: 50px;
            &.active {
                opacity: 1;
                font-size: 120%;
                background: $active-purple;
                font-weight: bold;
            }
            &-offset {
                pointer-events: none;
                cursor: default;
            }
        }
    }
}
</style>
