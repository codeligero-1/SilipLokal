window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#header');
  const footer = document.querySelector('#footer');
  if (!header) {
    console.error('No element with id="header" found');
    return;
  }
  if (!footer) {
    console.error('No element with id="footer" found');
    return;
  }

  header.innerHTML = `
    <nav>
        <img src="../images/logo.png" alt="SilipLokal Logo" class="logo">
        <a href="../pages/home.html">SilipLokal</a>
        <a href="../pages/home.html">Home</a>
        <a href="../pages/aboutus.html">About</a>
        <a href="../pages/catalogue.html">Catalogue</a>
        <a href="../pages/flea.html">Flea Markets</a>
        <a href="../pages/community.html">Community</a>
        <select id="theme">
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
        </select>
        <a href="../pages/login.html">Login</a>
    </nav>
  `;

    footer.innerHTML = `
        <div>
            <p>SilipLokal</p>
            <img src="fb.png" alt="facebook" class="fb"><a href="https://www.facebook.com/SilipLokal" target="_blank"></a>
            <img src="ig.png" alt="instagram" class="ig"><a href="https://www.instagram.com/SilipLokal" target="_blank"></a>
            <img src="email.png" alt="email" class="email"><a href="mailto:info@siliplokal.com"></a>
        </div>
            <p>&copy; 2026 SilipLokal. All rights reserved.</p>
        <div>
            <ul>
                <li><a href="faq.html">FAQs</a></li>
                <li><a href="terms.html">Terms and Conditions</a></li>
                <li><a href="login.html">Log In</a></li>
                <li><a href="signup.html">Sign Up</a></li>
            </ul>
        </div>
        <div>
            <p>Contact Us</p>
            <p>Phone: +63 912 345 6789</p>
            <p>Email: </p>
        </div>
    `;
});