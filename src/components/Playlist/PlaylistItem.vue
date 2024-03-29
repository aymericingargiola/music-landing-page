<template>
  <li class="playlist-item"
  :class="[{selected: selectedContent === music.id},
  {missing: !extra}]"
  @click="updateSelectedContent(music.id)" @keydown="updateSelectedContent(music.id)">
    <span class="cover">
      <img
          :src="`imgs/covers/${music.id}.jpg`"
          alt="cover"
          id="playerAlbumArt"
          onerror="this.src='imgs/covers/default-empty.png'"
        />
    </span>
    <div class="item-container" :type="music.extension">
      <div class="info-bar">
        <span class="small-info extension">{{ music.extension }}</span
        ><span class="small-info size">{{ convertSize(music.bytes) }}</span>
      </div>
      <div class="item-content">
        <a class="image" :type="music.extension" :href="music.url" target="_blank">download</a>
        <div class="info">
          <span class="artist">{{ music.artist }}</span>
          <span class="title">{{ music.title }}</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import format from '@/helpers/format';

export default {
  name: 'PlaylistItem',
  props: {
    music: Object,
    extra: Object,
    selectedContent: String,
  },
  methods: {
    convertSize(bytes) {
      return format.bytesToSize(bytes);
    },
    updateSelectedContent(id) {
      if (!this.selectedContent || this.selectedContent !== id) {
        this.$emit('update:selectedContent', id);
      } else if (this.selectedContent === id) {
        this.$emit('update:selectedContent', null);
      }
    },
  },
};
</script>

<style lang="scss">
.playlist-item {
  position: relative;
  background-color: color($color: $background2);
  border-radius: 6px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0);
  transition: 1s ease;
  overflow: hidden;
  //animation: show 1.5s;
  cursor: pointer;
  &.missing {
    //opacity: 0.25;
  }
  &:not(:first-child) {
    margin-top: 12px;
  }
  .cover {
    transition: 0.5s ease;
    position: absolute;
    z-index: 0;
    right: 0;
    height: 100%;
    pointer-events: none;
    border-radius: 6px;
    overflow: hidden;
    opacity: 0.15;
    &::after {
      content: '';
      transition: 0.5s ease;
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, $background2 10%, transparent 100%);
      left: 0;
      top: 0;
    }
    img {
      transition: 0.5s ease;
      height: 100%;
      width: 100%;
      object-fit: contain;
      object-position: right;
    }
  }
  .item-container {
    color: inherit;
    text-decoration: none;
    padding: 24px;
    display: block;
    z-index: 1;
    position: relative;
    .info-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: 11px;
      text-align: right;
      padding: 4px;
      overflow: hidden;
      .small-info {
        //background-color: rgba(54, 54, 54, 1);
        padding: 4px;
        pointer-events: none;
        transition: 0.5s ease;
        transform: translateY(100%);
        display: inline-block;
        opacity: 0;
        &:not(:first-child) {
          margin-left: 4px;
        }
        &:nth-child(2) {
          transition-delay: 0.1s;
        }
        &:nth-child(3) {
          transition-delay: 0.2s;
        }
        &:nth-child(4) {
          transition-delay: 0.3s;
        }
      }
    }
    .item-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      .image {
        font-size: 0px;
        position: relative;
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        background-color: $active-purple;
        background-image: url(simpleIcon(
          $icon: document,
          $color: $text
        ));
        background-position: center;
        background-size: 50%;
        background-repeat: no-repeat;
        margin-right: 24px;
        border-radius: 50px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        transition: 0.5s ease;
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: url(simpleIcon($icon: download, $color: $text));
          background-size: 50%;
          background-repeat: no-repeat;
          transition: 0.5s ease;
          opacity: 0;
          background-position: center;
          transform: scale(0);
        }
        &[type="mp3"],
        &[type="ogg"],
        &[type="wav"],
        &[type="flac"] {
          background-image: url(simpleIcon($icon: music, $color: $text));
        }
        &[type="zip"],
        &[type="rar"],
        &[type="bin"],
        &[type="tar"],
        &[type="7z"],
        &[type="wim"] {
          background-image: url(simpleIcon($icon: zip, $color: $text));
        }
        &[type="mp4"],
        &[type="mkv"] {
          background-image: url(simpleIcon($icon: video, $color: $text));
        }
        &:hover {
          background-color: $active-purple-hover;
          background-size: 0%;
          &::after {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        .artist {
          font-weight: bold;
          margin-bottom: 4px;
        }
        .title {
          font-size: 14px;
        }
      }
    }
  }
  &.selected {
    background-color: color($color: $active-purple-hover);
    .cover {
      &::after {
        background: linear-gradient(to right, $active-purple-hover 2%, transparent 100%);
      }
    }
  }
  &:hover {
    box-shadow: 0px 0px 15px color($color: $active-purple-hover, $opacity: 0.5);
    .cover {
      transform: translateX(100%);
    }
    .item-container {
      .info-bar {
        .small-info {
          transform: translateY(0%);
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
