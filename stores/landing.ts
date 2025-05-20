export const LANDING_PAGE_EXAMPLE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NextWave | Join Our Waitlist</title>
    <style>
      /* Reset and base styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      body {
        background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%);
        color: #fff;
        min-height: 100vh;
        line-height: 1.6;
      }

      /* Container */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      /* Header */
      header {
        padding: 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 24px;
        color: #fff;
        text-decoration: none;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #8a4fff 0%, #6c63ff 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      nav ul {
        display: flex;
        list-style: none;
        gap: 32px;
      }

      nav a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        font-size: 16px;
        transition: color 0.3s ease;
      }

      nav a:hover {
        color: #fff;
      }

      /* Hero Section */
      .hero {
        padding: 80px 0 40px;
        text-align: center;
        position: relative;
      }

      .badge {
        background: rgba(255, 255, 255, 0.1);
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .badge svg {
        margin-right: 8px;
      }

      h1 {
        font-size: 56px;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 24px;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      .hero-description {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.8);
        max-width: 600px;
        margin: 0 auto 40px;
      }

      /* Waitlist Form */
      .waitlist-form {
        display: flex;
        max-width: 500px;
        margin: 0 auto 60px;
        position: relative;
      }

      .waitlist-form input {
        flex: 1;
        padding: 16px 24px;
        border-radius: 50px;
        border: none;
        font-size: 16px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .waitlist-form input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      .waitlist-form input:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.4);
      }

      .waitlist-form button {
        position: absolute;
        right: 4px;
        top: 4px;
        bottom: 4px;
        padding: 0 24px;
        border-radius: 50px;
        border: none;
        background: linear-gradient(135deg, #8a4fff 0%, #6c63ff 100%);
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .waitlist-form button:hover {
        transform: translateY(-2px);
      }

      /* Feature Image */
      .feature-image {
        max-width: 900px;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 80px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .feature-image img {
        width: 100%;
        height: auto;
        display: block;
      }

      /* Features Section */
      .section {
        padding: 80px 0;
        position: relative;
      }

      .section-title {
        text-align: center;
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 60px;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
      }

      .feature-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 30px;
        transition: transform 0.3s ease, background 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .feature-card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.08);
      }

      .feature-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #8a4fff 0%, #6c63ff 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      }

      .feature-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
      }

      .feature-description {
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
      }

      /* Pricing Section */
      .pricing-plans {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin-top: 20px;
      }

      .pricing-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 40px 30px;
        text-align: center;
        transition: transform 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
      }

      .pricing-card.popular {
        background: rgba(138, 79, 255, 0.15);
        border: 1px solid rgba(138, 79, 255, 0.3);
        position: relative;
        transform: scale(1.05);
      }

      .popular-badge {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #8a4fff 0%, #6c63ff 100%);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }

      .pricing-card:hover:not(.popular) {
        transform: translateY(-5px);
      }

      .pricing-name {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .pricing-price {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .pricing-duration {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        margin-bottom: 30px;
      }

      .pricing-features {
        list-style: none;
        margin-bottom: 30px;
        flex-grow: 1;
      }

      .pricing-features li {
        padding: 8px 0;
        color: rgba(255, 255, 255, 0.8);
      }

      .pricing-btn {
        display: inline-block;
        padding: 12px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .pricing-btn.primary {
        background: linear-gradient(135deg, #8a4fff 0%, #6c63ff 100%);
        color: #fff;
      }

      .pricing-btn.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .pricing-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      /* Background Elements */
      .bg-gradient {
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(138, 79, 255, 0.3) 0%, rgba(138, 79, 255, 0) 70%);
        z-index: -1;
        filter: blur(60px);
      }

      .bg-gradient-1 {
        top: -200px;
        right: -100px;
      }

      .bg-gradient-2 {
        bottom: -300px;
        left: -200px;
      }

      /* Footer */
      footer {
        padding: 60px 0;
        text-align: center;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 40px;
      }

      .footer-links {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-bottom: 30px;
      }

      .footer-links a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: #fff;
      }

      .copyright {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }

      /* Responsive */
      @media (max-width: 992px) {

        .features,
        .pricing-plans {
          grid-template-columns: repeat(2, 1fr);
        }

        .pricing-card.popular {
          grid-column: span 2;
        }
      }

      @media (max-width: 768px) {
        nav ul {
          display: none;
        }

        h1 {
          font-size: 40px;
        }

        .hero {
          padding: 40px 0 20px;
        }

        .waitlist-form {
          flex-direction: column;
          gap: 16px;
        }

        .waitlist-form button {
          position: static;
          padding: 16px 24px;
          width: 100%;
        }

        .features,
        .pricing-plans {
          grid-template-columns: 1fr;
        }

        .pricing-card.popular {
          grid-column: span 1;
          transform: scale(1);
        }

        .section {
          padding: 60px 0;
        }
      }

    </style>
  </head>

  <body>
    <div class="bg-gradient bg-gradient-1"></div>
    <div class="bg-gradient bg-gradient-2"></div>

    <div class="container">
      <header>
        <a href="#" class="logo">
          <div class="logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="white" />
              <path d="M12 17L17 12L12 7V17Z" fill="white" />
            </svg>
          </div>
          NextWave
        </a>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
      </header>

      <section class="hero">
        <div class="badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6H12C9.79 6 8 7.79 8 10V15.5H12Z" fill="#8A4FFF" />
            <path
              d="M17.5 10C16.12 10 15 11.12 15 12.5V18H20.5C21.88 18 23 16.88 23 15.5C23 14.12 21.88 13 20.5 13C20.5 11.62 19.38 10.5 18 10.5C17.86 10.5 17.73 10.5 17.59 10.53C17.21 10.21 16.7 10 16.15 10H17.5Z"
              fill="#6C63FF" />
            <path
              d="M2 17.5C2 16.12 3.12 15 4.5 15H6V10.5C6 9.12 7.12 8 8.5 8C9.88 8 11 9.12 11 10.5V18H4.5C3.12 18 2 16.88 2 15.5Z"
              fill="#8A4FFF" />
          </svg>
          #1 AI-Powered Platform
        </div>
        <h1>Transform Your Ideas Into Reality</h1>
        <p class="hero-description">Join thousands of innovators on our waitlist. Be the first to experience our
          revolutionary platform that's changing the way people work.</p>

        <form class="waitlist-form">
        <input data-shipwait type="email" placeholder="Enter your email address" required>
        <button type="submit">Join Waitlist</button>
        </form>
        <p data-shipwait-message style="margin-top:16px;color:#8A4FFF;font-weight:600;text-align:center;display:block;"></p>
      </section>

      <section id="features" class="section">
        <h2 class="section-title">Powerful Features</h2>
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 11H4C2.9 11 2 11.9 2 13V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V13C22 11.9 21.1 11 20 11Z"
                  fill="white" />
                <path
                  d="M12 2C9.24 2 7 4.24 7 7V11H17V7C17 4.24 14.76 2 12 2ZM12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9Z"
                  fill="white" />
              </svg>
            </div>
            <h3 class="feature-title">Advanced Security</h3>
            <p class="feature-description">Enterprise-grade security with end-to-end encryption and multi-factor
              authentication to keep your data safe.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="white" />
                <path
                  d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                  fill="white" />
              </svg>
            </div>
            <h3 class="feature-title">AI-Powered Insights</h3>
            <p class="feature-description">Leverage machine learning algorithms to gain valuable insights and make
              data-driven decisions.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                  fill="white" />
              </svg>
            </div>
            <h3 class="feature-title">Real-time Analytics</h3>
            <p class="feature-description">Monitor performance metrics in real-time with customizable dashboards and
              automated reporting.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 6H3C2.45 6 2 6.45 2 7V17C2 17.55 2.45 18 3 18H21C21.55 18 22 17.55 22 17V7C22 6.45 21.55 6 21 6ZM11 13H8V16H6V13H3V11H6V8H8V11H11V13ZM15.5 15C14.67 15 14 14.33 14 13.5C14 12.67 14.67 12 15.5 12C16.33 12 17 12.67 17 13.5C17 14.33 16.33 15 15.5 15ZM19.5 12C18.67 12 18 11.33 18 10.5C18 9.67 18.67 9 19.5 9C20.33 9 21 9.67 21 10.5C21 11.33 20.33 12 19.5 12Z"
                  fill="white" />
              </svg>
            </div>
            <h3 class="feature-title">Seamless Integration</h3>
            <p class="feature-description">Connect with your favorite tools and services through our extensive API and
              pre-built integrations.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                  fill="white" />
              </svg>
            </div>
            <h3 class="feature-title">Team Collaboration</h3>
            <p class="feature-description">Work together seamlessly with real-time collaboration features, comments, and
              shared workspaces.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z"
                  fill="white" />
              </svg>
            </div>
            <h3 class="feature-title">Cloud Storage</h3>
            <p class="feature-description">Access your files from anywhere with unlimited cloud storage and automatic
              backups.</p>
          </div>
        </div>
      </section>

      <footer>
        <div class="copyright">© 2025 NextWave. All rights reserved.</div>
      </footer>
    </div>
  </body>

</html>`;
