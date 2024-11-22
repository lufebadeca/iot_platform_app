<template>
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a
            href="http://iotgator.com"
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            IoTgator
          </a>
        </li>
        <li class="nav-item">
          <a
            href="https://lufebadeca.github.io/portfolio/"
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            About Me
          </a>
        </li>
        <li class="nav-item">
          <a
            href="https://github.com/lufebadeca"
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            Github
          </a>
        </li>
      </ul>
      <div class="copyright">
        &copy; {{ year }}, made by
        <a
          href="https://lufebadeca.github.io/portfolio/"
          target="_blank"
          rel="noopener"
          >Luis Baldovino</a
        >
        <i class="tim-icons icon-laptop"></i>
        for powerful IoT ecosystems.
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
