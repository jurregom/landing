/* Magneto · Landing Talento en Salud
   Modal de registro en pasos: registro rápido → éxito → perfil opcional → final. */

(function () {
  "use strict";

  var modal = document.getElementById("registro-modal");
  var card = modal.querySelector(".modal__card");
  var steps = modal.querySelectorAll(".modal__step");
  var registroForm = document.getElementById("registro-form");
  var perfilForm = document.getElementById("perfil-form");
  var lastFocused = null;

  var STORAGE_KEY = "magneto-salud-registro";

  /* ---------- Integración ----------
     Punto único de envío de datos. Conecta aquí tu backend, CRM o el API
     de Magneto (fetch/POST). Mientras tanto persiste en localStorage. */
  function submitToBackend(payload) {
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) { /* storage vacío o corrupto */ }
    Object.assign(saved, payload, { actualizado: new Date().toISOString() });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) { /* modo privado: continuar sin persistencia */ }
    return Promise.resolve(saved);
  }

  /* ---------- Navegación de pasos ---------- */
  function showStep(name) {
    steps.forEach(function (step) {
      step.hidden = step.getAttribute("data-step") !== name;
    });
    card.scrollTop = 0;
    var focusable = card.querySelector(
      '.modal__step:not([hidden]) input, .modal__step:not([hidden]) select, .modal__step:not([hidden]) .btn'
    );
    if (focusable) focusable.focus();
  }

  function openModal(role) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (role) {
      var select = document.getElementById("p-profesion");
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === role) { select.selectedIndex = i; break; }
      }
    }
    showStep("registro");
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-role"));
    });
  });

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-close-modal]")) closeModal();
    if (e.target.closest("[data-goto-perfil]")) showStep("perfil");
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") trapFocus(e);
  });

  function trapFocus(e) {
    var focusables = card.querySelectorAll(
      'button, input, select, a[href], [tabindex]:not([tabindex="-1"])'
    );
    var visible = Array.prototype.filter.call(focusables, function (el) {
      return el.offsetParent !== null;
    });
    if (!visible.length) return;
    var first = visible[0];
    var last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------- Validación del registro ---------- */
  function setInvalid(input, invalid) {
    var field = input.closest(".field");
    var error = field.querySelector(".field__error");
    field.classList.toggle("is-invalid", invalid);
    if (error) error.hidden = !invalid;
    input.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function validateRegistro() {
    var ok = true;
    var nombre = document.getElementById("f-nombre");
    var telefono = document.getElementById("f-telefono");
    var correo = document.getElementById("f-correo");
    var datos = document.getElementById("f-datos");

    var nombreOk = nombre.value.trim().split(/\s+/).length >= 2;
    setInvalid(nombre, !nombreOk);

    var telOk = /^[0-9\s]{7,13}$/.test(telefono.value.trim());
    setInvalid(telefono, !telOk);

    var mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.value.trim());
    setInvalid(correo, !mailOk);

    setInvalid(datos, !datos.checked);

    ok = nombreOk && telOk && mailOk && datos.checked;
    if (!ok) {
      var firstInvalid = registroForm.querySelector(".is-invalid input");
      if (firstInvalid) firstInvalid.focus();
    }
    return ok;
  }

  ["f-nombre", "f-telefono", "f-correo", "f-datos"].forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener("input", function () { setInvalid(input, false); });
    input.addEventListener("change", function () { setInvalid(input, false); });
  });

  registroForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateRegistro()) return;

    var nombre = document.getElementById("f-nombre").value.trim();
    submitToBackend({
      nombre: nombre,
      telefono: "+57 " + document.getElementById("f-telefono").value.trim(),
      correo: document.getElementById("f-correo").value.trim(),
      aceptaTratamientoDatos: true,
      fechaRegistro: new Date().toISOString()
    }).then(function () {
      var span = modal.querySelector("[data-nombre]");
      span.textContent = nombre.split(/\s+/)[0];
      showStep("exito");
    });
  });

  /* ---------- Perfil opcional ---------- */
  perfilForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var cv = document.getElementById("p-cv");
    submitToBackend({
      profesion: document.getElementById("p-profesion").value,
      especialidad: document.getElementById("p-especialidad").value.trim(),
      ciudad: document.getElementById("p-ciudad").value.trim(),
      experiencia: document.getElementById("p-experiencia").value,
      rethus: document.getElementById("p-rethus").value.trim(),
      cvAdjunto: cv.files.length ? cv.files[0].name : ""
    }).then(function () {
      showStep("final");
    });
  });
})();
