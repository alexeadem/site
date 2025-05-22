# Glossary

#### \* qbo: pronounced - letter `q` + bow (as in bow-tie)

{% raw %}
<!-- Hidden audio player -->
<audio id="qboAudio" src="qbo-pronunciation.wav"></audio>

<!-- Play icon -->
<i id="qboPlayIcon"
   class='bx bx-play-circle'
   style="font-size: 40px; color: #4783ef; cursor: pointer; transition: color 0.3s ease;"
   onclick="playQBOAudio()"></i>

<!-- Optional: tooltip or text -->
<!-- <span>Play QBO pronunciation</span> -->

<script>
  function playQBOAudio() {
    const audio = document.getElementById('qboAudio');
    const icon = document.getElementById('qboPlayIcon');

    // Play audio
    audio.play();

    // Trigger color change animation
    icon.style.color = '#bebebe'; // cyan or greenish tone
    setTimeout(() => {
      icon.style.color = '#4783ef'; // revert to original
    }, 400);
  }
</script>
{% endraw %}