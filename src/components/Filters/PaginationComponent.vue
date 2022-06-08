<template>
    <div v-if="pages > 1" class="pagination-container">
        <div class="pagination">
            <template v-for="page in pages">
                <div v-if="showPage(page)"
                :class="['page', currentPage === page ? 'active' : '']"
                @click="changePage(page)"
                @keydown="changePage(page)"
                :key="`page-${page}`">{{page}}</div>
                <div v-if="showOffset(page)"
                class="page-offset"
                :key="`offset page-${page}`">...</div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    itemsTotal: Number,
    itemsPerPage: Number,
    maxPagesVisible: Number,
    currentPage: Number,
  },
  computed: {
    pages() {
      return Math.ceil(this.itemsTotal / this.itemsPerPage);
    },
    getMaxPages() {
      return this.maxPagesVisible ? this.maxPagesVisible : 3;
    },
    maxPagesRange() {
      const pagesRange = [this.currentPage];
      for (let pageNb = 1; pageNb < this.getMaxPages; pageNb += 1) {
        pagesRange.push(this.currentPage - pageNb, this.currentPage + pageNb);
      }
      return pagesRange;
    },
  },
  methods: {
    changePage(page) {
      this.$emit('update:pagination', page);
    },
    showPage(page) {
      return page === 1
      || page === this.pages
      || this.maxPagesRange.includes(page);
    },
    showOffset(page) {
      return (((page > 1 && page < this.pages)
      && ((page === this.currentPage - this.getMaxPages)
      && (this.currentPage > this.getMaxPages)))
      || ((page === this.currentPage + this.getMaxPages)
      && (this.currentPage < this.pages - this.getMaxPages)));
    },
  },
};
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
