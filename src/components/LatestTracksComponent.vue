<template>
  <div v-if="itemsOrderedByReleaseDate" class="latest-tracks-component col-12">
    <div class="component-content">
      <div class="title">
      <h2>Latest tracks</h2>
    </div>
      <div class="content">
        <transition-group name="playlist-items" tag="ul">
          <template v-for="music in itemsOrderedByReleaseDate" :key="music.id">
            <li class="col-12 col-lg-4">
              <div class="content">
                <div class="date">{{ releaseDate(music.releaseTimestamp) }}</div>
                <div class="track-name">
                  <div class="artist">{{ music.artist }}</div>
                  <div class="title">{{ music.title }}</div>
                </div>
                <div class="links">
                  <a v-if="getMp3Url(music.id)"
                  :href="getMp3Url(music.id)" target="_blank">MP3</a>
                  <a v-if="getWavUrl(music.id)"
                  :href="getWavUrl(music.id)" target="_blank">WAV</a>
                  <a v-if="getVideoUrl(music.id)"
                  :href="getVideoUrl(music.id)" target="_blank">Video</a>
                </div>
              </div>
            </li>
          </template>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    playlists: Object,
    selectedContent: String,
    filtering: Boolean,
  },
  name: 'LatestTracksComponent',
  setup(props) {
    const itemsOrderedByReleaseDate = computed(() => {
      if (!props.playlists.extra || props.playlists.extra.length < 1) return [];
      const extras = [...props.playlists.extra];
      return extras.sort((a, b) => b.releaseTimestamp - a.releaseTimestamp).slice(0, 3);
    });
    const getMp3Url = (id) => props.playlists.mp3?.find((m) => m.id === id)?.url;
    const getWavUrl = (id) => props.playlists.wav?.find((m) => m.id === id)?.url;
    const getVideoUrl = (id) => props.playlists.video?.find((m) => m.id === id)?.url;
    const releaseDate = (timestamp) => {
      const date = timestamp
        ? new Date(parseInt(timestamp, 10) * 1000)
        : null;
      const options = {
        year: 'numeric', month: 'long', day: 'numeric',
      };
      if (!date) return date;
      return date.toLocaleDateString('en-US', options);
    };
    return {
      itemsOrderedByReleaseDate,
      getMp3Url,
      getWavUrl,
      getVideoUrl,
      releaseDate,
    };
  },
};
</script>

<style lang="scss">
.latest-tracks-component {
  .component-content {
    margin-bottom: 20px;
    padding: 30px;
    border-radius: 5px;
    background-color: color($background3, 0.5);
    backdrop-filter: blur(20px);
  }
  .title {
    h2 {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  .content {
    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -12px;
      li {
        margin-top: 18px;
        padding: 0px 12px;
        .content {
          background: $background;
          padding: 15px;
          border-radius: 5px;
          height: 100%;
          display: flex;
          flex-direction: column;
          .date {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            opacity: 0.6;
          }
          .track-name {
            margin-bottom: 8px;
            .artist {
              font-weight: bold;
              margin-bottom: 8px;
            }
            .title {
              font-size: 14px;
            }
          }
          .links {
            margin-top: auto;
            a {
              &:not(:first-child) {
                margin-left: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
