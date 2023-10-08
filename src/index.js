import { connectJoyCon, connectedJoyCons, JoyConLeft, JoyConRight, GeneralController } from "joy-con-webhid"

// Connect Joy-Cons via WebHID
const connectButton = document.querySelector("#connect-joy-cons")
connectButton.addEventListener("click", connectJoyCon)

const animateButton = (id, condition) => {
  document.querySelector(id).classList.toggle("highlight", condition)
}

const playSound = (key) => {
  if (!key) return
  const audioElement = document.querySelector(`audio[data-key="${key}"]`)
  audioElement.play()
}

const visualize = (joyCon, packet) => {
  if (!packet || !packet.actualOrientation) {
    return
  }
  const { buttonStatus: buttons } = packet

  if (joyCon instanceof JoyConLeft || joyCon instanceof GeneralController) {
    animateButton("#up", buttons.up)
    animateButton("#down", buttons.down)
    animateButton("#left", buttons.left)
    animateButton("#right", buttons.right)
    animateButton("#capture", buttons.capture)
    animateButton("#l", buttons.l || buttons.zl)
    animateButton("#minus", buttons.minus)
    animateButton("#joystick-left", buttons.leftStick)

    if (buttons.up) {
      playSound("crash")
    }

    if (buttons.down) {
      playSound("snare")
    }

    if (buttons.left) {
      playSound("hi-hat")
    }

    if (buttons.right) {
      playSound("hi-hat-open")
    }

    if (buttons.l) {
      playSound("clap")
    }

    if (buttons.zl) {
      playSound("bass")
    }
  }

  if (joyCon instanceof JoyConRight || joyCon instanceof GeneralController) {
    animateButton("#a", buttons.a)
    animateButton("#b", buttons.b)
    animateButton("#x", buttons.x)
    animateButton("#y", buttons.y)
    animateButton("#home", buttons.home)
    animateButton("#r", buttons.r || buttons.zr)
    animateButton("#plus", buttons.plus)
    animateButton("#joystick-right", buttons.rightStick)

    if (buttons.a) {
      playSound("tom-l")
    }

    if (buttons.b) {
      playSound("tom-f")
    }

    if (buttons.x) {
      playSound("ride")
    }

    if (buttons.y) {
      playSound("tom-s")
    }

    if (buttons.r) {
      playSound("tink")
    }

    if (buttons.zr) {
      playSound("bass")
    }
  }
}

// Joy-Cons may sleep until touched, so attach the listener dynamically.
setInterval(async () => {
  for (const joyCon of connectedJoyCons.values()) {
    if (joyCon.eventListenerAttached) {
      continue
    }
    joyCon.eventListenerAttached = true
    await joyCon.enableVibration()
    joyCon.addEventListener("hidinput", (event) => {
      visualize(joyCon, event.detail)
    })
  }
}, 2000)

// Controls modal
const controlsModal = document.getElementById("controls")
const controlsModalBtn = document.getElementById("btn-controls")
const closeBtn = document.getElementsByClassName("close")[0]

controlsModalBtn.onclick = function () {
  controlsModal.style.display = "block"
}

closeBtn.onclick = () => {
  controlsModal.style.display = "none"
}

window.onclick = (event) => {
  if (event.target === controlsModal) {
    controlsModal.style.display = "none"
  }
}
