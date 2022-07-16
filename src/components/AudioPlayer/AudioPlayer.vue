<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <div
    class="audioContainer"
    :class="{ playing: currentlyPlaying, playlistActive: isPlaylistActive }"
    v-if="ready"
  >
    <!--<div
      class="background-cover"
      :style="{ backgroundImage: 'url(' + musicPlaylist[currentSong].image + ')' }"
    ></div>-->
    <div class="background-cover"></div>
    <div
      class="audioPlayerUI isOpen"
      @mouseover="notHovering = false"
      @mouseout="notHovering = true"
      @focusin="notHovering = false"
      @focusout="notHovering = true"
      :class="{ isDisabled: isPlaylistActive, notHovering: notHovering }"
    >
      <div class="track-info">
        <div class="albumImage">
          <transition
            name="ballmove"
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutLeft"
            mode="out-in"
          >
            <img
              :src="`imgs/covers/${musicPlaylist[currentSong].id}.jpg`"
              :key="currentSong"
              alt="cover"
              ondragstart="return false;"
              id="playerAlbumArt"
              onerror="this.src='imgs/covers/default-2.png'"
            />
          </transition>
          <!--<div class="loader" :key="currentSong">Loading...</div>-->
        </div>
        <div class="albumDetails">
          <transition name="slide-fade" mode="out-in">
            <p class="title" :key="currentSong">{{ musicPlaylist[currentSong].title }}</p>
          </transition>
          <transition name="slide-fade" mode="out-in">
            <p class="artist" :key="currentSong">{{ musicPlaylist[currentSong].artist }}</p>
          </transition>
        </div>

        <div class="playerButtons">
          <a
            v-on:click="
              [
                shufflePlay ? (shuffleTemp = []) : '',
                (shufflePlay = !shufflePlay)
              ]
            "
            :class="['button shuffle', shufflePlay ? 'active' : 'disabled']"
            title="shuffle"
          >
            <font-awesome-icon icon="random" />
          </a>
          <a
            class="button download-icon"
            v-on:click="downloadTrack()"
            title="download"
            tabindex="0"
            v-on:keyup.enter="downloadTrack()"
          >
            <font-awesome-icon icon="download" />
          </a>
          <a
            class="button"
            :class="[
              (shufflePlay && shuffleTemp.indexOf(currentSong) === 0) ||
              (shufflePlay && shuffleTemp.length < 1)
                ? 'isDisabled'
                : !shufflePlay && currentSong === 0
                ? 'isDisabled'
                : ''
            ]"
            v-on:click="prevSong()"
            title="previous"
            tabindex="0"
            v-on:keyup.enter="prevSong()"
          >
            <font-awesome-icon icon="fa-solid fa-backward-fast" />
          </a>
          <a
            class="button play"
            v-on:click="playAudio()"
            title="play"
            tabindex="0"
            v-on:keyup.enter="playAudio()"
          >
            <TransitionGroup name="slide-fade" mode="out-in">
              <font-awesome-icon v-if="currentlyStopped" icon="stop-circle" :key="1" />
              <font-awesome-icon v-if="currentlyPlaying" icon="pause-circle" :key="1" />
              <font-awesome-icon v-if="!currentlyPlaying" icon="play-circle" :key="1" />
            </TransitionGroup>
          </a>
          <a
            class="button"
            :class="[
              shufflePlay &&
              shuffleTemp.length == musicPlaylist.length - 1 &&
              shuffleTemp.indexOf(currentSong) === -1
                ? 'isDisabled'
                : !shufflePlay && currentSong === musicPlaylist.length - 1
                ? 'isDisabled'
                : ''
            ]"
            v-on:click="nextSong()"
            title="next"
            tabindex="0"
            v-on:keyup.enter="nextSong()"
          >
            <font-awesome-icon icon="fa-solid fa-forward-fast" />
          </a>
          <!-- <a
            class="nav-icon"
            v-on:click="isPlaylistActive = !isPlaylistActive"
            :class="{ isActive: isPlaylistActive }"
            title="playlist"
            tabindex="0"
            v-on:keyup.enter="isPlaylistActive = !isPlaylistActive"
          >
            <font-awesome-icon icon="list-alt" />
          </a> -->
          <a class="button vol-button" v-on:click="muteAudio()">
            <font-awesome-icon
              :icon="
                this.volume === 0
                  ? 'volume-mute'
                  : this.volume <= 25
                  ? 'volume-off'
                  : this.volume <= 65
                  ? 'volume-down'
                  : 'volume-up'
              "
            />
          </a>
            <vue3-slider v-model="volume" />
        </div>
      </div>
      <div class="duration-progress-container">
        <div class="currentTimeContainer" style="text-align:center">
          <span class="currentTime">{{ fancyTimeFormat(currentTime) }}</span>
        </div>

        <div class="currentProgressBar" v-on:click="changeTime($event)">
          <div
            class="currentProgress"
            :style="{ transform: 'scaleX(' + currentProgressBar / 100 + ')' }"
          ></div>
        </div>

        <div class="currentTimeContainer" style="text-align:center">
          <span class="totalTime">{{ fancyTimeFormat(trackDuration) }}</span>
        </div>
      </div>
    </div>
    <div class="audioPlayerList" :class="{ isActive: isPlaylistActive }">
      <div class="playlistcontainer">
        <div class="playlistrow">
          <div
            class="mix item"
            v-for="(item, index) in musicPlaylist"
            :key="index"
            v-bind:class="{ isActive: isCurrentSong(index) }"
            v-on:click="changeSong(index)"
            :data-title="item.titlefilter"
            :data-artist="item.artistfilter"
          >
            <div
              class="vatilt item-container"
              data-tilt
              data-tilt-perspective="1000"
              data-tilt-glare
              data-tilt-max-glare="1"
              data-tilt-reverse="true"
              tabindex="0"
              v-on:keyup.enter="changeSong(index)"
            >
              <font-awesome-icon icon="volume-up" />
              <div class="image-container">
                <div
                  class="lazyload cover"
                  :data-test="item.thumbnail"
                  :data-bg-multi="
                    'url(' +
                      item.thumbnail +
                      '), url(images/covers/default-2.png)'
                  "
                >
                  <svg v-if="coverSvg === true" id="loading" x="0px" y="0px" viewBox="0 0 150 150">
                    <circle id="loading-inner" cx="75" cy="75" r="60" />
                  </svg>
                </div>
              </div>
              <p class="title">{{ item.title }}</p>
              <p class="artist">{{ item.artist }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="search-container">
        <form class="controls">
          <fieldset data-filter-group class="text-input-wrapper">
            <input
              type="text"
              data-search-attribute="data-title"
              placeholder="title"
            />
          </fieldset>

          <fieldset data-filter-group class="text-input-wrapper">
            <input
              type="text"
              data-search-attribute="data-artist"
              placeholder="artist"
            />
          </fieldset>
        </form>
        <div class="mixitup-page-list"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
import slider from 'vue3-slider';

export default {
  props: {
    playlist: Array,
    selectedContent: String,
    pushTracks: Array,
    shuffle: Boolean,
  },
  data() {
    return {
      ready: false,
      audio: null,
      notHovering: true,
      currentlyPlaying: false,
      currentlyStopped: false,
      currentTime: 0,
      checkingCurrentPositionInTrack: '',
      trackDuration: 0,
      currentProgressBar: 0,
      volume: 100,
      volumeTemp: 100,
      shufflePlay: false,
      shuffleTemp: [],
      isPlaylistActive: false,
      currentSong: 0,
      debug: false,
      coverSvg: false,
      musicPlaylist: [],
      audioFile: '',
    };
  },
  components: {
    'vue3-slider': slider,
  },
  created() {
  },
  async mounted() {
    this.getPlaylist();
    this.changeSong();
    this.audio.loop = false;
  },
  methods: {
    initPlaylist(pl) {
      if (this.shuffle) {
        for (let i = pl.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = pl[i];
          pl[i] = pl[j];
          pl[j] = temp;
        }
      }
      if (this.pushTracks) {
        this.pushTracks.forEach((filter) => {
          function filterPlaylist(music, index, array) {
            if (music.filter.includes(filter)) {
              pl.splice(index, 1);
              pl.unshift(music);
            }
          }
          pl.findIndex(filterPlaylist);
        });
      }
      this.musicPlaylist = pl;
      if (this.selectedContent) {
        this.selectedContentChanged();
      }
      return (this.ready = true);
    },
    getPlaylist() {
      this.initPlaylist(this.playlist);
    },
    fancyTimeFormat(s) {
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s;
    },
    togglePlaylist() {
      this.isPlaylistActive = !this.isPlaylistActive;
    },
    downloadTrack() {
      window.open(this.musicPlaylist[this.currentSong].url);
    },
    nextSong() {
      if (this.shufflePlay) {
        if (this.shuffleTemp.includes(this.currentSong)
        && this.shuffleTemp.indexOf(this.currentSong) < this.shuffleTemp.length - 1) {
          this.changeSong(
            this.shuffleTemp[this.shuffleTemp.indexOf(this.currentSong) + 1],
          );
        } else if (
          (this.shuffleTemp.length !== this.musicPlaylist.length - 1)
        && (this.shuffleTemp.indexOf(this.currentSong) !== this.musicPlaylist.length - 1)
        ) {
          if (this.shuffleTemp.indexOf(this.currentSong) === -1) {
            this.shuffleTemp.push(this.currentSong);
          }
          let newRandomTrack = Math.floor(
            Math.random() * (this.musicPlaylist.length - 1 - 0 + 1),
          ) + 0;
          while (this.shuffleTemp.includes(newRandomTrack)) {
            newRandomTrack = Math.floor(
              Math.random() * (this.musicPlaylist.length - 1 - 0 + 1),
            ) + 0;
            console.log(newRandomTrack);
          }
          this.changeSong(newRandomTrack);
        }
      } else if (this.currentSong < this.musicPlaylist.length - 1) {
        this.changeSong(this.currentSong + 1);
      }
    },
    prevSong() {
      if (this.shufflePlay) {
        if (this.shuffleTemp.indexOf(this.currentSong) === -1) {
          this.changeSong(this.shuffleTemp[this.shuffleTemp.length - 1]);
        } else if (
          this.shuffleTemp.includes(this.currentSong)
          && this.shuffleTemp.indexOf(this.currentSong) !== 0
        ) {
          this.changeSong(
            this.shuffleTemp[this.shuffleTemp.indexOf(this.currentSong) - 1],
          );
        }
      } else if (this.currentSong > 0) {
        this.changeSong(this.currentSong - 1);
      }
    },
    selectedContentChanged() {
      const songIndex = this.musicPlaylist?.findIndex((s) => s.id === this.selectedContent);
      if (songIndex > -1) this.changeSong(songIndex);
    },
    changeSong(index) {
      const wasPlaying = this.currentlyPlaying;
      this.imageLoaded = false;
      if (index !== undefined) {
        if (this.audio) this.stopAudio();
        this.currentSong = index;
      }
      this.audioFile = this.musicPlaylist[this.currentSong].url;
      this.audio = new Audio(this.audioFile);
      this.audio.volume = this.volume / 100;
      const localThis = this;
      this.audio.addEventListener('loadedmetadata', function () {
        localThis.trackDuration = Math.round(this.duration);
      });
      this.audio.addEventListener('ended', this.handleEnded);
      if (wasPlaying) {
        this.playAudio();
      }
      if (this.musicPlaylist[this.currentSong].id !== this.selectedContent) {
        this.$emit('update:selectedContent', this.musicPlaylist[this.currentSong].id);
      }
    },
    isCurrentSong(index) {
      if (this.currentSong === index) {
        return true;
      }
      return false;
    },
    getCurrentSong(currentSong) {
      return this.musicPlaylist[currentSong].url;
    },
    playAudio() {
      if (
        this.currentlyStopped === true
        && this.currentSong + 1 === this.musicPlaylist.length
      ) {
        this.currentSong = 0;
        this.changeSong();
      }
      if (!this.currentlyPlaying) {
        this.getCurrentTimeEverySecond(true);
        this.currentlyPlaying = true;
        this.audio.play();
      } else {
        this.stopAudio();
      }
      this.currentlyStopped = false;
    },
    stopAudio() {
      this.audio.pause();
      this.currentlyPlaying = false;
      this.pausedMusic();
    },
    handleEnded() {
      if (this.currentSong + 1 === this.musicPlaylist.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.currentSong++;
        this.changeSong();
        this.playAudio();
      }
    },
    getCurrentTimeEverySecond() {
      const localThis = this;
      this.checkingCurrentPositionInTrack = setTimeout(
        () => {
          localThis.currentTime = localThis.audio.currentTime;
          localThis.currentProgressBar = (localThis.audio.currentTime
          / localThis.trackDuration) * 100;
          localThis.getCurrentTimeEverySecond(true);
        },
        200,
      );
    },
    pausedMusic() {
      clearTimeout(this.checkingCurrentPositionInTrack);
    },
    changeTime(event) {
      if (this.currentlyPlaying) {
        const mouseX = event.offsetX;
        const newTime = (mouseX * this.trackDuration) / event.target.offsetWidth;
        this.audio.currentTime = newTime;
        this.currentProgressBar = (this.audio.currentTime / this.trackDuration) * 100;
      }
    },
    muteAudio() {
      if (this.volume !== 0) {
        this.volumeTemp = this.volume;
        this.volume = 0;
        this.audio.volume = 0;
      } else {
        this.volume = this.volumeTemp;
        this.audio.volume = this.volume / 100;
      }
    },
  },
  watch: {
    currentTime() {
      this.currentTime = Math.round(this.currentTime);
    },
    volume() {
      this.audio.volume = this.volume / 100;
    },
    selectedContent() {
      this.selectedContentChanged();
    },
  },
  beforeUnmount() {
    if (this.audio) this.audio.removeEventListener('ended', this.handleEnded);
    if (this.audio) this.audio.removeEventListener('loadedmetadata', this.handleEnded);
    clearTimeout(this.checkingCurrentPositionInTrack);
  },
};
</script>

<style lang="scss">
@import '../../styles/variables/colors';
@import '../../styles/functions/import.scss';

$primary_color: rgba(0, 0, 0, 0.75);
$player_width: 20rem;
$player_padding: 1rem;
$button_size: 1rem;
$anim_duration: 0.5s;

$tablet-width: 768px;
$desktop-width: 992px;
@mixin phone {
  @media (max-width: #{$tablet-width - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$tablet-width}) and (max-width: #{$desktop-width - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$desktop-width}) {
    @content;
  }
}

@mixin phoneAndTablet {
  @media (max-width: #{$desktop-width - 1px}) {
    @content;
  }
}

* {
  box-sizing: border-box;
}
.animated {
  animation-duration: $anim_duration;
}
.audioContainer {
  z-index: 200;
  position: fixed;
  bottom: 0px;
  left: 0px;
  //background-color: #313131;

  width: 100%;

  overflow: hidden;

  //padding: $player_padding;
  margin: 0 auto;

  border-radius: 0px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);

  user-select: none;

  transform: translateY(55vh);

  transition: 0.5s ease, transform 0.5s ease;

  .background-cover {
    z-index: -1;
    position: absolute;
    //top: 10%;
    //left: -30px;
    top: 0px;
    left: 0px;
    //height: 110%;
    //width: 110%;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    //filter: blur(30px);
    opacity: 1;
    transition: background-image 1s ease, background-color 1s ease,
      opacity 1s ease;

    //background: $dark-background !important;
    &::before {
      //content: "";
      position: absolute;
      height: 120%;
      width: 100%;
      background: linear-gradient(#000 40%, transparent 100%);
      left: 0px;
      top: 0px;
      opacity: 1;
    }
  }

  .nav-icon {
    //width: 15px;
    //height: 12px;
    font-size: 1rem;
    display: inline-block;
    vertical-align: middle;
    padding: 0.5rem;
    margin: 0 0.25rem;
    color: rgba(255, 255, 255, 1);
    border-radius: 50%;
    outline: 0;
    text-decoration: none;
    cursor: pointer;

    //position: absolute;
    //top: ($player_padding)- ($player_padding/4);
    //left: $player_padding;

    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
    &:active {
      opacity: 0.75;
      transform: scale(0.75);
    }
  }
  .audioPlayerList {
    display: none;
    color: $primary_color;
    transition: $anim_duration;
    //transform: translateX(-200%);
    //position: absolute;
    z-index: 10;
    width: 100%;
    height: 55vh;
    margin-top: 0px;
    will-change: transform;

    padding: 30px;
    padding-top: 0px;
    padding-bottom: 0px;

    display: flex;
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 40px;
      background: linear-gradient(#000 0%, transparent 100%);
      top: 0px;
      left: 0px;
      opacity: 0.1;
      pointer-events: none;
    }
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 15px;
      background: linear-gradient(to top, transparent, #000);
      top: 0px;
      left: 0px;
      opacity: 0.35;
      z-index: 10;
      pointer-events: none;
    }
    &.isActive {
      //margin-top: $player_padding;
      height: 55vh;
    }
    .playlistcontainer {
      overflow: visible;
      overflow-y: auto;
      height: 100%;
      width: 70%;
      padding: 30px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        //width: 6px;
        //height: 6px;
        display: none;
        width: 0px;
        height: 0px;
        background: transparent;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
      }
      .playlistrow {
        margin-top: -30px;
        margin-left: -15px;
        margin-right: -15px;
        display: flex;
        flex-wrap: wrap;
        .item {
          padding: 15px;
          //border-left: 0.1rem solid transparent;
          width: 33.3333333333%;
          flex: 0 1 auto;
          &:hover {
            cursor: pointer;
          }
          .js-tilt-glare {
            .js-tilt-glare-inner {
              transform: translateZ(50px);
              background-image: linear-gradient(
                0deg,
                color(light-cyan, 0.3) 0%,
                color(white, 0.2) 100%
              ) !important;
            }
          }
          .item-container {
            transform-style: preserve-3d;
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 15px;
            transition: background-color 0.5s ease, box-shadow 0.5s ease,
              transform-style 0.5s ease, transform-style 0.5s ease;
            background-color: rgba(255, 255, 255, 0.05);
            position: relative;
            &:not(:hover) {
              //transform-style: flat !important;
            }
            > svg {
              position: absolute;
              left: 15px;
              top: 15px;
              opacity: 0;
              color: #fff;
              font-size: 12px;
              transition: 1s ease;
            }
            .image-container {
              transform: translateZ(0px);
              height: 150px;
              width: 150px;
              //margin-bottom: auto;
              margin-left: auto;
              margin-right: auto;
              padding: 15px;
              transition: transform 0.5s ease;
              .cover {
                height: 100%;
                width: 100%;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                position: relative;
                #loading {
                  z-index: -1;
                  position: absolute;
                  left: 0px;
                  top: 0px;
                  width: 100%;
                  height: 100%;
                  //animation: loading 3s linear infinite;
                  padding: 15px;
                  #loading-inner {
                    stroke: {
                      dashoffset: 0;
                      dasharray: 300;
                      width: 10;
                      miterlimit: 10;
                      linecap: round;
                    }
                    //animation: loading-circle 2s linear infinite;
                    stroke: #fff;
                    fill: transparent;
                  }
                }
                @keyframes loading {
                  0% {
                    transform: rotate(0);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
                @keyframes loading-circle {
                  0% {
                    stroke-dashoffset: 0;
                  }
                  100% {
                    stroke-dashoffset: -600;
                  }
                }
                &[data-was-processed="true"] {
                  #loading {
                    animation: none;
                  }
                }
              }
            }
            .title {
              transform: translateZ(0px);
              color: rgba(255, 255, 255, 1);
              font-size: 0.9rem;
              //margin-bottom: 0.75rem;
              padding-bottom: 18px;
              margin-bottom: auto;
              margin-top: auto;
              padding-bottom: 10px;
              transition: transform 0.5s ease;
            }
            .artist {
              transform: translateZ(0px);
              color: rgba(255, 255, 255, 0.8);
              font-size: 0.7rem;
              font-weight: bold;
              transition: transform 0.5s ease;
            }
            &:hover,
            &:focus,
            &:hover:focus {
              box-shadow: 0px 0px 10px color(black, 0.2);
              outline: none;
              .image-container {
                transform: translateZ(-10px);
              }
              .title {
                transform: translateZ(10px);
              }
              .artist {
                transform: translateZ(30px);
              }
            }
          }
          &.isActive {
            .item-container {
              box-shadow: 0px 0px 10px color(black, 0.2);
              background-color: rgba(255, 255, 255, 0.5);
              > svg {
                opacity: 1;
              }
              &:hover,
              &:focus,
              &:hover:focus {
                outline: none;
                .title {
                  transform: translateZ(20px);
                }
                .artist {
                  transform: translateZ(15px);
                }
                .image-container {
                  transform: translateZ(30px);
                }
              }
            }
          }
        }
      }
    }
    .search-container {
      width: 30%;
      padding-right: 39px;
      padding-left: 20px;
      .controls {
        padding-top: 7px;
        fieldset {
          input {
            width: 100%;
            background: rgba(255, 255, 255, 0.5);
            border: 0px solid rgba(0, 0, 0, 0.05);
            padding: 0.5em;
            margin: 0.5em;
            border-radius: 0px;
            box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.05);
            &:focus {
              outline: none;
            }
            &::placeholder {
              color: #313131;
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  .audioPlayerUI {
    padding: $player_padding;
    transform: translateY(100%);
    margin-top: 0px;
    will-change: transform, filter;
    transition: $anim_duration;
    transition: 0.6s cubic-bezier(0, 0, 0.25, 2);
    transition-delay: 0ms;
    background-color: rgba($background2, 0.95);
    backdrop-filter: blur(5px);
    //box-shadow: 0px 10px 20px rgba(0,0,0,0.2);
    &.isDisabled {
      //transform: scale(0.75) translateX(100%);
      //filter: blur(5px) grayscale(100%);
    }
    &.isOpen {
      transform: translateY(0%);
    }
    .track-info {
      overflow: hidden;
      z-index: 1;
      display: flex;
      align-items: center;
      max-width: 800px;
      margin: auto;
      margin-bottom: 1em;
      transition: 0.5s ease;
      .albumDetails {
        text-align: left;
        margin: 0em 1em 0em 0em;
        min-width: 0px;
        z-index: 1;
        p {
          margin: 0px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &.title {
            font-size: 1rem;
            color: rgba(255, 255, 255, 1);
          }
          &.artist {
            margin-top: 0rem;
            font-size: 0.7rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.8);
            transition-delay: 100ms;
          }
        }
      }
      .albumImage {
        z-index: 1;
        opacity: 1;
        width: 100px;
        max-width: 100px;
        min-width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 18px;
        //transition: height 0.5s ease, margin-right 1s cubic-bezier(0, 0, 0.25, 2);
        transition-duration: 0.5s, 0.5s, 0.5s, 0.5s, 0.5s, 0.7s;
        transition-timing-function: ease, ease, ease, ease, ease,
          cubic-bezier(0, 0, 0.25, 2), ease, ease;
        transition-delay: 0s, 0s, 0s, 0s, 0s, 0.5s, 0s, 0s;
        transition-property: width, max-width, min-width, height, opacity,
          margin-right, margin-left, padding;
        img {
          width: 100%;
          height: 100%;
          z-index: 10;
          object-fit: cover;
          object-position: 50% 50%;
        }
      }
      .playerButtons {
        z-index: 1;
        position: relative;
        margin-left: auto;
        margin-bottom: 0rem;
        text-align: center;
        display: flex;
        align-items: center;
        &* {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .button {
          font-size: $button_size;
          display: inline-block;
          vertical-align: middle;
          padding: 0.5rem;
          margin: 0 0.25rem;
          color: rgba(255, 255, 255, 1);
          border-radius: 50%;

          outline: 0;
          text-decoration: none;
          cursor: pointer;
          transition: $anim_duration;

          &.play {
            font-size: 2 * $button_size;
            margin: 0 0rem;
          }
          &.download {
          }
          &:active {
            opacity: 0.75;
            transform: scale(0.75);
          }
          &.isDisabled {
            color: rgba(255, 255, 255, 0.4);
            cursor: initial;
          }
          &.isDisabled:active {
            transform: none;
          }
          &.vol-button {
            padding-right: 0px;
            min-width: 26px;
            display: flex;
          }
          &.shuffle {
            svg {
              path {
                transition: 0.5s ease;
              }
            }
            &.active {
              svg {
                path {
                  fill: $active-purple;
                }
              }
            }
          }
        }
        .vue3-slider {
          padding: 0 4px;
          width: 100px;
          overflow: hidden;
          .track {
            border-radius: 0px;
            background-color: color(white, 0.5);
          }
          .track-filled {
            background-color: $active-purple;
            border-radius: 0px;
          }
          .handle {
            border-radius: 0px;
            // height: 10px;
            // width: 8px;
            background-color: white;
          }
        }
      }
    }
    .duration-progress-container {
      z-index: 0;
      display: flex;
      max-width: 800px;
      margin: auto;
      min-height: 15px;
      transition: 0.5s ease;
      &:hover {
        .currentProgressBar {
          cursor: pointer;
          transform: scaleY(1);
          border-radius: 10px;
        }
      }
      .currentTimeContainer {
        pointer-events: none;
        z-index: 0;
        height: auto;
        width: auto;
        padding: 0em 0em;
        display: flex;
        align-items: center;

        .currentTime,
        .totalTime {
          font-size: 1rem;
          color: rgba(255, 255, 255, 1);
          display: flex;
          align-items: center;
          font-variant-numeric: tabular-nums;
        }
        .currentTime {
          float: left;
          position: absolute;
          left: 55px;
          top: 20px;
          font-size: 6em;
          line-height: normal;
          opacity: 0.2;
          transition: 1s ease;
        }
        .totalTime {
          float: right;
          position: absolute;
          right: 55px;
          top: 20px;
          font-size: 6em;
          line-height: normal;
          opacity: 0.2;
          transition: 1s ease;
        }
      }

      .currentProgressBar {
        z-index: 1;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.4);
        transform: scaleY(0.3);
        position: relative;
        transition: 0.5s ease;
        height: 15px;
        border-radius: 5px;
        overflow: hidden;
        .currentProgress {
          position: absolute;
          bottom: 0px;
          background-color: $active-purple;
          width: 100%;
          transform: scaleX(0);
          transform-origin: left;
          height: 100%;
          transition: 0ms;
          pointer-events: none;
        }
      }
    }
    &.notHovering:not(.isDisabled) {
      padding-top: 0px;
      padding-bottom: 0px;
      .track-info {
        margin-bottom: 0em;
        .albumImage {
          //width: 0px;
          //height: 0px;
          //opacity: 0;
          //margin-right: 0em;
          //margin-left: -108px;
          height: 50px;
          width: 50px;
          max-width: 50px;
          min-width: 50px;
          //padding: 15px;
        }
      }
      .duration-progress-container {
        min-height: 0px;
        .currentTimeContainer {
          .currentTime {
            opacity: 0;
          }
          .totalTime {
            opacity: 0;
          }
        }

        .currentProgressBar {
          margin: 0px;
          height: 0px;
        }
      }
    }
  }
  &.playlistActive {
    transform: translateY(0vh);
    @supports (backdrop-filter: blur(10px)) {
      & {
        background-color: rgba(0, 0, 0, 0);
        backdrop-filter: blur(3px) brightness(0.5) grayscale(100);
        .background-cover {
          opacity: 0.7;
        }
      }
    }
  }
}

/* data change transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $anim_duration;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

//tablet
@include tablet {
  .audioContainer {
    .audioPlayerUI {
      .duration-progress-container {
        align-items: center;
        .currentTimeContainer {
          .currentTime,
          .totalTime {
            float: none;
            position: static;
            left: auto;
            top: auto;
            font-size: 0.8rem;
            opacity: 0.8;
            padding: 0px 4px;
            width: 40px;
            display: flex;
            justify-content: center;
          }
        }
      }
    }
    .audioPlayerList {
      height: 55vh;

      &.isActive {
        height: 55vh;
      }

      .playlistcontainer {
        .playlistrow {
          .item {
            width: 50%;
            .item-container {
              transform-style: flat;
              transform: inherit;
              .image-container {
                transform: inherit;
              }
              .title {
                transform: inherit;
              }
              .artist {
                transform: inherit;
              }
              &:hover {
                box-shadow: none;
              }
            }
            &.isActive {
              .item-container {
                box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
                background-color: rgba(255, 255, 255, 0.4);
                > i {
                  opacity: 1;
                }
                .title {
                  transform: inherit;
                }
                .artist {
                  transform: inherit;
                }
                .image-container {
                  transform: inherit;
                }
              }
            }
          }
        }
      }
      .search-container {
        width: 30%;
        padding-right: 39px;
        padding-left: 20px;
        .controls {
          padding-top: 7px;
        }
      }
    }
    &:not(.playlistActive) {
      .audioPlayerUI {
        &.notHovering {
          .currentTimeContainer {
            .currentTime,
            .totalTime {
              font-size: 0px;
            }
          }
        }
      }
    }
  }
}

//mobile
@include phone {
  .audioContainer {
    max-height: 100vh;
    transform: translateY(45vh);
    .audioPlayerUI {
      .track-info {
        flex-direction: column;
        .albumImage {
          margin-right: 0px;
        }
        .albumDetails {
          width: 100%;
          margin-right: 0px;
          text-align: center;
          max-height: 100px;
          padding: 15px 0px;
          opacity: 1;
          transition: 0.5s ease;
        }
        .playerButtons {
          width: 100%;
          justify-content: center;
        }
      }
      .duration-progress-container {
        align-items: center;
        .currentTimeContainer {
          .currentTime,
          .totalTime {
            float: none;
            position: static;
            left: auto;
            top: auto;
            font-size: 0.8rem;
            opacity: 0.8;
            padding: 0px 4px;
            width: 40px;
            display: flex;
            justify-content: center;
          }
        }
      }
      &.notHovering:not(.isDisabled) {
        .track-info {
          .albumImage {
            opacity: 0px;
            height: 1px;
            width: 1px;
          }
          .albumDetails {
            width: 100%;
            margin-right: 0px;
            text-align: center;
            max-height: 0px;
            padding: 0px;
            opacity: 0;
            transition: 0.5s ease;
          }
        }
        .duration-progress-container {
          height: 0px;
        }
      }
    }
    .audioPlayerList {
      height: 45vh;
      padding-left: 15px;
      padding-right: 15px;
      .playlistcontainer {
        padding-left: 0px;
        padding-right: 5px;
        .playlistrow {
          .item {
            width: 100%;
          }
        }
      }
      .search-container {
        padding-right: 15px;
        padding-left: 5px;
      }
    }
  }
}

//Edge
@supports (-ms-ime-align: auto) {
  .audioContainer {
    .audioPlayerList {
      .playlistcontainer {
        .playlistrow {
          .item {
            .item-container {
              transform-style: flat;
              transform: inherit;
              .image-container {
                transform: inherit;
              }
              .title {
                transform: inherit;
              }
              .artist {
                transform: inherit;
              }
              &:hover {
                box-shadow: none;
              }
            }
            &.isActive {
              .item-container {
                .title {
                  transform: inherit;
                }
                .artist {
                  transform: inherit;
                }
                .image-container {
                  transform: inherit;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
