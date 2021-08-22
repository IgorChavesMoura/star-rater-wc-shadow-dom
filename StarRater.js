class StarRater extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.appendChild(this.styles());

    this.currentRatingValue = this.getAttribute('data-rating') || '0';

    this.value = Number(this.getAttribute('data-rating'));

    this.rater = this.createRater();
    this.stars = this.createStars();

    this.stars.forEach(star => this.rater.appendChild(star));

    this.highlightRating();

    shadow.appendChild(this.rater);
  }

  createRater() {
    const rater = document.createElement('div');
    rater.classList.add('star-rater');

    return rater;
  }

  createStars() {
    function* generateStars() {
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.setAttribute('data-value', i);
        star.innerHTML = '&#9733;';

        star.addEventListener('click', event => this.setRating(event));

        star.addEventListener('mouseover', event => this.setRatingHover(event));

        star.addEventListener('mouseleave', event =>
          this.setRatingMouseLeave(event)
        );

        yield star;
      }
    }

    return Array.from(generateStars.apply(this));
  }

  setRating(event) {
    this.setAttribute(
      'data-rating',
      event.currentTarget.getAttribute('data-value')
    );

    if (Number(this.getAttribute('data-rating')) != this.value) {
      this.value = Number(this.getAttribute('data-rating'));

      this.emitOnChange();
    }
  }

  setRatingHover(event) {
    this.currentRatingValue = event.currentTarget.getAttribute('data-value');
    this.highlightRating();
  }

  setRatingMouseLeave(event) {
    this.currentRatingValue = this.getAttribute('data-rating') || '0';
    this.highlightRating();
  }

  highlightRating() {
    this.stars.forEach(star => {
      const starDataValue = Number(star.getAttribute('data-value'));
      const currentRatingValue = Number(this.currentRatingValue);

      if (starDataValue <= currentRatingValue) {
        star.classList.add('highlight');
      } else {
        star.classList.remove('highlight');
      }
    });
  }

  emitOnChange() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);
    event.eventName = 'change';

    this.dispatchEvent(event);
  }

  styles() {
    const style = document.createElement('style');

    style.textContent = `

        .star-rater {

            

        }

        .star-rater > .star {

            font-size: 5rem;
            color: gray;
            cursor: pointer;

        }

        .star-rater > .star.highlight {

            color: yellow;

        }

    `;

    return style;
  }
}

customElements.define('star-rater', StarRater);
