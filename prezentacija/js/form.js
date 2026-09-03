(function () {
  const form = document.getElementById("question-form");
  const statusEl = document.getElementById("form-status");
  const configBanner = document.getElementById("form-config-banner");
  if (!form || !statusEl) return;

  const config = window.SOS_FORM_CONFIG || {};
  const actionUrl = (config.ACTION_URL || "").trim();
  const fields = config.FIELDS || {};
  const configured =
    actionUrl.length > 0 &&
    fields.name &&
    fields.email &&
    fields.question;

  if (!configured && configBanner) {
    configBanner.hidden = false;
  }

  function showStatus(type, message) {
    statusEl.className = "form-status is-" + type;
    statusEl.textContent = message;
    statusEl.hidden = false;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!configured) {
      showStatus(
        "info",
        "Формата уште не е поврзана со Google Form. Пополни js/form-config.js (види README)."
      );
      return;
    }

    const name = form.elements.namedItem("name").value.trim();
    const email = form.elements.namedItem("email").value.trim();
    const question = form.elements.namedItem("question").value.trim();

    if (!name || !email || !question) {
      showStatus("error", "Пополни ги сите полиња.");
      return;
    }

    const body = new URLSearchParams();
    body.append(fields.name, name);
    body.append(fields.email, email);
    body.append(fields.question, question);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // no-cors: браузерот не чита одговор од Google, но барањето стигнува
    fetch(actionUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    })
      .then(function () {
        form.reset();
        showStatus(
          "success",
          "Прашањето е испратено. Ќе одговориме подоцна на твојот контакт."
        );
      })
      .catch(function () {
        showStatus(
          "error",
          "Нешто тргна наопаку. Пробај повторно или пиши директно на предавачот."
        );
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
