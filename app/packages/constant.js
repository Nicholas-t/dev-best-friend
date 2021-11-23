require('dotenv').config();

const pageTypes = {
    playground : {
        label : "Playground",
        description : "A playground for your API with form like interface"
    }, batch : {
        label : "Batch",
        description : "Allow your users to upload csv and call your API in batch"
    }, dashboard : {
        label : "Dashboard",
        description : "Dashboard from your API's with a predefined parameter"
    }, external_url : {
        label : "External Link",
        description : "Redirect to a seperate link"
    }, docs : {
        label : "Documents",
        description : "You can have  documents in an markdown text-rich format"
    }
}
const userTypes = {
    dev : {
        key : "dev",
        label : "Developers"
    }, client : {
        key : "client",
        label  : "Client"
    }
}

const apiMethod = {
    methods : [
        "get", "post"
    ]
}
const apiOutputType = {
    api_output_type : [
        "file",
        "json",
        "chart",
        "table"
    ]
}
const apiInputType = {
    api_input_type : [
        "string",
        "number",
        "datetime-local",
        "checkbox",
        "email",
        "color"
    ]
}
const iconList = {
    icon_list : [
        "access-point",
        "access-point-network",
        "account",
        "air-conditioner",
        "airballoon",
        "airplane",
        "airplane-landing",
        "airplay",
        "alarm",
        "alert",
        "alert-box",
        "alpha",
        "alphabetical",
        "ambulance",
        "amplifier",
        "anchor",
        "android",
        "android-debug-bridge",
        "android-studio",
        "animation",
        "apps",
        "archive",
        "arrow-all",
        "arrow-bottom-left",
        "arrow-compress",
        "arrow-compress-all",
        "arrow-down",
        "arrow-expand",
        "arrow-expand-all",
        "arrow-left",
        "arrow-left-bold",
        "arrow-right",
        "arrow-right-bold",
        "arrow-top-left",
        "arrow-top-right",
        "arrow-up",
        "assistant",
        "attachment",
        "audiobook",
        "av-timer",
        "baby",
        "backburger",
        "backspace",
        "backup-restore",
        "bank",
        "barcode",
        "barcode-scan",
        "barley",
        "barrel",
        "basket",
        "basket-fill",
        "basket-unfill",
        "battery",
        "battery-50",
        "battery-alert",
        "battery-charging",
        "battery-charging-100",
        "beach",
        "beer",
        "behance",
        "bell",
        "beta",
        "bible",
        "bike",
        "binoculars",
        "bio",
        "biohazard",
        "bitbucket",
        "black-mesa",
        "blender",
        "blinds",
        "block-helper",
        "bone",
        "book",
        "book-open",
        "book-plus",
        "book-variant",
        "bookmark",
        "boombox",
        "border-vertical",
        "bowl",
        "bowling",
        "box",
        "bridge",
        "briefcase",
        "briefcase-check",
        "briefcase-download",
        "brightness-auto",
        "broom",
        "brush",
        "buffer",
        "bug",
        "bulletin-board",
        "bullhorn",
        "bullseye",
        "burst-mode",
        "bus",
        "cached",
        "cake",
        "calculator",
        "calendar",
        "camcorder",
        "camera",
        "candle",
        "candycane",
        "car",
        "car-wash",
        "cards",
        "carrot",
        "cart",
        "cart-off",
        "cart-plus",
        "case-sensitive-alt",
        "cash",
        "cash-100",
        "cash-usd",
        "cast",
        "cast-connected",
        "castle",
        "cat",
        "cellphone",
        "cellphone-android",
        "cellphone-basic",
        "cellphone-dock",
        "cellphone-iphone",
        "cellphone-link",
        "cellphone-link-off",
        "cellphone-settings",
        "certificate",
        "chair-school",
        "chart-arc",
        "chart-areaspline",
        "chart-bar",
        "chart-bubble",
        "chart-gantt",
        "chart-gantt",
        "chart-histogram",
        "chart-line",
        "chart-pie",
        "chart-scatterplot-hexbin",
        "check",
        "check-all",
        "checkbox-blank",
        "checkbox-marked",
        "checkerboard",
        "chemical-weapon",
        "chemical-weapon",
        "chevron-double-down",
        "chevron-double-left",
        "chevron-double-right",
        "chevron-double-up",
        "chevron-down",
        "chevron-left",
        "chevron-right",
        "chevron-up",
        "chip",
        "church",
        "cisco-webex",
        "city",
        "clipboard",
        "clipboard-account",
        "clipboard-alert",
        "clipboard-arrow-down",
        "clipboard-arrow-left",
        "clipboard-check",
        "clipboard-text",
        "clippy",
        "clock",
        "clock-alert",
        "clock-end",
        "clock-fast",
        "clock-in",
        "clock-out",
        "clock-start",
        "close",
        "close-box",
        "close-network",
        "close-octagon",
        "closed-caption",
        "cloud",
        "cloud-check",
        "cloud-download",
        "cloud-print",
        "cloud-sync",
        "cloud-upload",
        "code-array",
        "code-braces",
        "code-brackets",
        "code-equal",
        "code-greater-than",
        "code-greater-than-or-equal",
        "code-less-than",
        "code-less-than-or-equal",
        "code-not-equal",
        "code-not-equal-variant",
        "code-parentheses",
        "code-string",
        "code-tags",
        "codepen",
        "coffee",
        "coffee-to-go",
        "coin",
        "collage",
        "color-helper",
        "comment",
        "comment-account",
        "comment-alert",
        "comment-check",
        "comment-processing",
        "comment-text",
        "compare",
        "compass",
        "console",
        "contact-mail",
        "content-copy",
        "content-cut",
        "content-duplicate",
        "content-paste",
        "content-save",
        "content-save-all",
        "content-save-settings",
        "contrast",
        "contrast-box",
        "cookie",
        "copyright",
        "counter",
        "cow",
        "credit-card",
        "credit-card-off",
        "credit-card-scan",
        "crop",
        "crop-free",
        "crop-landscape",
        "crop-portrait",
        "crop-square",
        "crosshairs",
        "crosshairs-gps",
        "crown",
        "cube",
        "cube-send",
        "cube-unfolded",
        "cup",
        "cup-off",
        "cup-water",
        "currency-btc",
        "currency-eur",
        "currency-gbp",
        "currency-inr",
        "currency-ngn",
        "currency-rub",
        "currency-try",
        "currency-usd",
        "cursor-default",
        "cursor-move",
        "cursor-pointer",
        "cursor-text",
        "database",
        "database-minus",
        "database-plus",
        "debug-step-into",
        "debug-step-out",
        "debug-step-over",
        "decimal-decrease",
        "delete",
        "delete-forever",
        "delete-sweep",
        "delete-variant",
        "delta",
        "deskphone",
        "desktop-mac",
        "desktop-tower",
        "details",
        "deviantart",
        "dialpad",
        "diamond",
        "dice-1",
        "dice-2",
        "dice-3",
        "dice-4",
        "dice-5",
        "dice-6",
        "dice-d20",
        "dice-d4",
        "dice-d6",
        "dice-d8",
        "dictionary",
        "directions",
        "directions-fork",
        "discord",
        "disk",
        "disk-alert",
        "disqus",
        "division",
        "division-box",
        "dns",
        "domain",
        "dots-horizontal",
        "dots-vertical",
        "download",
        "drag",
        "drag-horizontal",
        "drag-vertical",
        "drawing",
        "drawing-box",
        "dribbble",
        "dribbble-box",
        "drone",
        "dropbox",
        "drupal",
        "duck",
        "dumbbell",
        "earth",
        "earth-off",
        "edge",
        "eject",
        "elevation-decline",
        "elevation-rise",
        "elevator",
        "email",
        "email-open",
        "email-secure",
        "email-variant",
        "emoticon",
        "emoticon-cool",
        "emoticon-devil",
        "emoticon-happy",
        "emoticon-neutral",
        "emoticon-poop",
        "emoticon-sad",
        "emoticon-tongue",
        "engine",
        "equal",
        "equal-box",
        "eraser",
        "eraser-variant",
        "escalator",
        "ethernet",
        "ethernet-cable",
        "ethernet-cable-off",
        "etsy",
        "ev-station",
        "evernote",
        "exclamation",
        "exit-to-app",
        "export",
        "eye",
        "eye-off",
        "eyedropper",
        "eyedropper-variant",
        "face",
        "face-profile",
        "facebook",
        "facebook-box",
        "facebook-messenger",
        "factory",
        "fan",
        "fast-forward",
        "fax",
        "ferry",
        "file",
        "file-chart",
        "file-check",
        "file-cloud",
        "file-delimited",
        "file-document",
        "file-document-box",
        "file-excel",
        "file-excel-box",
        "file-export",
        "file-find",
        "file-hidden",
        "file-image",
        "file-import",
        "file-lock",
        "file-music",
        "file-pdf",
        "file-pdf-box",
        "file-powerpoint",
        "file-powerpoint-box",
        "file-restore",
        "file-send",
        "file-tree",
        "file-video",
        "file-word",
        "file-word-box",
        "file-xml",
        "film",
        "filmstrip",
        "filmstrip-off",
        "filter",
        "filter-remove",
        "filter-variant",
        "fingerprint",
        "fire",
        "firefox",
        "fish",
        "flag",
        "flag-checkered",
        "flag-triangle",
        "flag-variant",
        "flash",
        "flash-auto",
        "flash-off",
        "flashlight",
        "flashlight-off",
        "flask",
        "flask-empty",
        "flattr",
        "flask-empty",
        "flattr",
        "flip-to-back",
        "flip-to-front",
        "floppy",
        "flower",
        "folder",
        "folder-account",
        "folder-download",
        "folder-google-drive",
        "folder-image",
        "folder-lock",
        "folder-lock-open",
        "folder-move",
        "folder-plus",
        "folder-remove",
        "folder-upload",
        "food",
        "food-apple",
        "food-fork-drink",
        "food-off",
        "food-variant",
        "football",
        "football-australian",
        "football-helmet",
        "format-align-center",
        "format-align-justify",
        "format-align-left",
        "format-align-right",
        "format-annotation-plus",
        "format-bold",
        "format-clear",
        "format-color-fill",
        "format-float-center",
        "format-float-left",
        "format-float-none",
        "format-float-right",
        "format-header-1",
        "format-header-2",
        "format-header-3",
        "format-header-4",
        "format-header-5",
        "format-header-6",
        "format-header-decrease",
        "format-header-equal",
        "format-header-increase",
        "format-header-pound",
        "format-horizontal-align-center",
        "format-horizontal-align-left",
        "format-horizontal-align-right",
        "format-indent-decrease",
        "format-indent-increase",
        "format-italic",
        "format-line-spacing",
        "format-line-style",
        "format-line-weight",
        "format-list-bulleted",
        "format-list-bulleted-type",
        "format-list-numbers",
        "format-paint",
        "format-paragraph",
        "format-quote",
        "format-size",
        "format-strikethrough",
        "format-strikethrough-variant",
        "format-subscript",
        "format-superscript",
        "format-text",
        "format-textdirection-l-to-r",
        "format-textdirection-r-to-l",
        "format-title",
        "format-underline",
        "format-vertical-align-bottom",
        "format-vertical-align-center",
        "format-vertical-align-top",
        "format-wrap-inline",
        "format-wrap-square",
        "format-wrap-tight",
        "format-wrap-top-bottom",
        "forum",
        "forward",
        "foursquare",
        "fridge",
        "fridge-filled",
        "fridge-filled-bottom",
        "fridge-filled-top",
        "fullscreen",
        "fullscreen-exit",
        "function",
        "gamepad",
        "gamepad-variant",
        "gas-cylinder",
        "gas-station",
        "gate",
        "gauge",
        "gavel",
        "gender-female",
        "gender-male",
        "gender-male-female",
        "gender-transgender",
        "ghost",
        "gift",
        "git",
        "github-box",
        "glass-flute",
        "glass-mug",
        "glass-stange",
        "glass-tulip",
        "glassdoor",
        "glasses",
        "gmail",
        "gnome",
        "google",
        "google-cardboard",
        "google-chrome",
        "google-controller",
        "google-controller-off",
        "google-drive",
        "google-earth",
        "google-glass",
        "google-maps",
        "google-nearby",
        "google-pages",
        "google-physical-web",
        "google-play",
        "google-plus",
        "google-plus-box",
        "google-translate",
        "google-wallet",
        "grease-pencil",
        "grid",
        "grid-off",
        "group",
        "grid-off",
        "group",
        "guitar-electric",
        "guitar-pick",
        "hackernews",
        "hand-pointing-right",
        "hanger",
        "hangouts",
        "harddisk",
        "headphones",
        "headphones-box",
        "headphones-settings",
        "headset",
        "headset-dock",
        "headset-off",
        "heart",
        "heart-box",
        "heart-broken",
        "heart-pulse",
        "help",
        "hexagon",
        "highway",
        "history",
        "hololens",
        "home",
        "home-map-marker",
        "home-modern",
        "home-variant",
        "hops",
        "hospital",
        "hospital-building",
        "hospital-marker",
        "hotel",
        "houzz",
        "houzz-box",
        "human",
        "human-child",
        "human-female",
        "human-greeting",
        "human-handsdown",
        "human-handsup",
        "human-male",
        "human-male-female",
        "human-pregnant",
        "image",
        "image-album",
        "image-area",
        "image-area-close",
        "image-broken",
        "image-broken-variant",
        "image-filter",
        "image-filter-black-white",
        "image-filter-center-focus",
        "image-filter-center-focus-weak",
        "image-filter-drama",
        "image-filter-frames",
        "image-filter-hdr",
        "image-filter-none",
        "image-filter-tilt-shift",
        "image-filter-vintage",
        "import",
        "inbox",
        "incognito",
        "information",
        "information-variant",
        "instagram",
        "instapaper",
        "internet-explorer",
        "invert-colors",
        "jeepney",
        "jira",
        "jsfiddle",
        "json",
        "keg",
        "kettle",
        "key",
        "key-change",
        "key-minus",
        "key-plus",
        "key-remove",
        "key-variant",
        "keyboard",
        "keyboard-backspace",
        "keyboard-caps",
        "keyboard-close",
        "keyboard-off",
        "keyboard-return",
        "keyboard-tab",
        "keyboard-variant",
        "kodi",
        "label",
        "lambda",
        "lan",
        "lan-connect",
        "lan-disconnect",
        "lan-pending",
        "language-c",
        "language-cpp",
        "language-csharp",
        "language-css3",
        "language-html5",
        "language-javascript",
        "language-php",
        "language-python",
        "language-python-text",
        "laptop",
        "laptop-chromebook",
        "laptop-mac",
        "laptop-windows",
        "lastfm",
        "launch",
        "layers",
        "layers-off",
        "lead-pencil",
        "leaf",
        "led-off",
        "led-on",
        "led-variant-off",
        "led-variant-on",
        "library",
        "library-books",
        "library-music",
        "library-plus",
        "lightbulb",
        "link",
        "link-off",
        "link-variant",
        "link-variant-off",
        "linkedin",
        "linkedin-box",
        "linux",
        "lock",
        "lock-open",
        "lock-plus",
        "login",
        "login-variant",
        "logout",
        "logout-variant",
        "looks",
        "loupe",
        "lumx",
        "magnet",
        "magnet-on",
        "magnify",
        "magnify-minus",
        "magnify-plus",
        "mail-ru",
        "map",
        "map-marker",
        "map-marker-minus",
        "map-marker-off",
        "map-marker-plus",
        "map-marker-radius",
        "margin",
        "markdown",
        "marker",
        "marker-check",
        "martini",
        "material-ui",
        "math-compass",
        "matrix",
        "maxcdn",
        "medium",
        "memory",
        "menu",
        "menu-down",
        "menu-left",
        "menu-right",
        "menu-up",
        "message",
        "message-alert",
        "message-draw",
        "message-image",
        "message-plus",
        "message-processing",
        "message-reply",
        "message-reply-text",
        "message-text",
        "message-video",
        "meteor",
        "microphone",
        "microphone-off",
        "microphone-settings",
        "microphone-variant",
        "microphone-variant-off",
        "microscope",
        "microsoft",
        "minecraft",
        "minus",
        "minus-box",
        "minus-network",
        "mixcloud",
        "monitor",
        "more",
        "motorbike",
        "mouse",
        "mouse-off",
        "mouse-variant",
        "mouse-variant-off",
        "move-resize",
        "move-resize-variant",
        "movie",
        "music-box",
        "music-note",
        "music-note-bluetooth",
        "music-note-bluetooth-off",
        "music-note-eighth",
        "music-note-half",
        "music-note-off",
        "music-note-quarter",
        "music-note-sixteenth",
        "music-note-whole",
        "nature",
        "nature-people",
        "navigation",
        "near-me",
        "needle",
        "nest-protect",
        "nest-thermostat",
        "new-box",
        "newspaper",
        "nfc",
        "nfc-tap",
        "nfc-variant",
        "nodejs",
        "note",
        "note-plus",
        "note-text",
        "notification-clear-all",
        "numeric",
        "numeric-0-box",
        "numeric-1-box",
        "numeric-2-box",
        "numeric-3-box",
        "numeric-4-box",
        "numeric-5-box",
        "numeric-6-box",
        "numeric-7-box",
        "numeric-8-box",
        "numeric-9-box",
        "numeric-9-plus-box",
        "nutrition",
        "octagon",
        "odnoklassniki",
        "office",
        "oil",
        "oil-temperature",
        "omega",
        "onedrive",
        "opacity",
        "open-in-app",
        "open-in-new",
        "openid",
        "opera",
        "ornament",
        "ornament-variant",
        "outbox",
        "owl",
        "package",
        "package-down",
        "package-up",
        "package-variant",
        "package-variant-closed",
        "page-first",
        "page-last",
        "palette",
        "palette-advanced",
        "panda",
        "pandora",
        "panorama",
        "panorama-fisheye",
        "panorama-horizontal",
        "panorama-vertical",
        "panorama-wide-angle",
        "paper-cut-vertical",
        "paperclip",
        "parking",
        "pause",
        "pause-octagon",
        "paw",
        "paw-off",
        "pen",
        "pencil",
        "pencil-box",
        "pencil-lock",
        "pencil-off",
        "percent",
        "pharmacy",
        "phone",
        "phone-bluetooth",
        "phone-classic",
        "phone-forward",
        "phone-hangup",
        "phone-in-talk",
        "phone-incoming",
        "phone-locked",
        "phone-log",
        "phone-minus",
        "phone-missed",
        "phone-outgoing",
        "phone-paused",
        "phone-plus",
        "phone-settings",
        "phone-voip",
        "pi",
        "pi-box",
        "pig",
        "pill",
        "pin",
        "pin-off",
        "pine-tree",
        "pine-tree-box",
        "pinterest",
        "pinterest-box",
        "pizza",
        "play",
        "play-pause",
        "play-protected-content",
        "playlist-check",
        "playlist-minus",
        "playlist-play",
        "playlist-plus",
        "playlist-remove",
        "playstation",
        "plus",
        "plus-box",
        "plus-network",
        "plus-one",
        "pocket",
        "pokeball",
        "polaroid",
        "poll",
        "poll-box",
        "polymer",
        "pool",
        "popcorn",
        "pot",
        "pot-mix",
        "pound",
        "pound-box",
        "power",
        "power-settings",
        "power-socket",
        "presentation",
        "presentation-play",
        "printer",
        "printer-3d",
        "printer-alert",
        "priority-high",
        "priority-low",
        "professional-hexagon",
        "projector",
        "projector-screen",
        "pulse",
        "puzzle",
        "qqchat",
        "qrcode",
        "qrcode-scan",
        "quadcopter",
        "quality-high",
        "quicktime",
        "radar",
        "radiator",
        "radio",
        "radio-handheld",
        "radio-tower",
        "radioactive",
        "radiobox-blank",
        "radiobox-marked",
        "raspberrypi",
        "ray-end",
        "ray-end-arrow",
        "ray-start-end",
        "ray-vertex",
        "rdio",
        "read",
        "readability",
        "receipt",
        "record",
        "record-rec",
        "recycle",
        "reddit",
        "redo",
        "redo-variant",
        "refresh",
        "regex",
        "relative-scale",
        "reload",
        "remote",
        "rename-box",
        "repeat",
        "repeat-off",
        "repeat-once",
        "replay",
        "reply",
        "reply-all",
        "reproduction",
        "resize-bottom-right",
        "responsive",
        "rewind",
        "ribbon",
        "road",
        "road-variant",
        "rocket",
        "rotate-3d",
        "rotate-left",
        "rotate-left-variant",
        "rotate-right",
        "rotate-right-variant",
        "rounded-corner",
        "router-wireless",
        "routes",
        "rowing",
        "rss",
        "rss-box",
        "ruler",
        "run",
        "sale",
        "satellite",
        "satellite-variant",
        "saxophone",
        "scale",
        "scale-balance",
        "scale-bathroom",
        "school",
        "screen-rotation",
        "screen-rotation-lock",
        "screwdriver",
        "script",
        "sd",
        "seal",
        "seat-flat",
        "seat-flat-angled",
        "seat-individual-suite",
        "seat-legroom-extra",
        "seat-legroom-normal",
        "seat-legroom-reduced",
        "seat-recline-extra",
        "seat-recline-normal",
        "security",
        "security-network",
        "select",
        "select-all",
        "select-inverse",
        "select-off",
        "selection",
        "send",
        "serial-port",
        "server",
        "server-minus",
        "server-network",
        "server-network-off",
        "server-off",
        "server-plus",
        "server-remove",
        "server-security",
        "settings",
        "settings-box",
        "shape-plus",
        "shape-polygon-plus",
        "shape-rectangle-plus",
        "shape-square-plus",
        "share",
        "share-variant",
        "shield",
        "shopping",
        "shopping-music",
        "shredder",
        "shuffle",
        "shuffle-disabled",
        "shuffle-variant",
        "sigma",
        "sigma-lower",
        "sign-caution",
        "signal",
        "signal-variant",
        "silverware",
        "silverware-fork",
        "silverware-spoon",
        "silverware-variant",
        "sim",
        "sim-alert",
        "sim-off",
        "sitemap",
        "skip-backward",
        "skip-forward",
        "skip-next",
        "skip-previous",
        "skype",
        "skype-business",
        "slack",
        "sleep",
        "sleep-off",
        "smoking",
        "smoking-off",
        "snapchat",
        "snowman",
        "soccer",
        "sofa",
        "sort",
        "sort-alphabetical",
        "sort-ascending",
        "sort-descending",
        "sort-numeric",
        "sort-variant",
        "soundcloud",
        "source-branch",
        "source-fork",
        "source-merge",
        "source-pull",
        "speaker",
        "speaker-off",
        "speedometer",
        "spellcheck",
        "spotify",
        "spotlight",
        "spotlight-beam",
        "spray",
        "square-inc",
        "square-inc-cash",
        "stackexchange",
        "stackoverflow",
        "stairs",
        "star",
        "star-half",
        "star-off",
        "steam",
        "steering",
        "step-backward",
        "step-backward-2",
        "step-forward",
        "step-forward-2",
        "stethoscope",
        "sticker",
        "stocking",
        "stop",
        "store",
        "store-24-hour",
        "stove",
        "subdirectory-arrow-left",
        "subdirectory-arrow-right",
        "subway",
        "sunglasses",
        "surround-sound",
        "swap-horizontal",
        "swap-vertical",
        "swim",
        "switch",
        "sword",
        "sync",
        "sync-alert",
        "sync-off",
        "tab",
        "tab-unselected",
        "table",
        "table-column-plus-after",
        "table-column-plus-before",
        "table-column-remove",
        "table-column-width",
        "table-edit",
        "table-large",
        "table-row-height",
        "table-row-plus-after",
        "table-row-plus-before",
        "table-row-remove",
        "tablet",
        "tablet-android",
        "tablet-ipad",
        "tag",
        "tag-faces",
        "target",
        "taxi",
        "teamviewer",
        "telegram",
        "television",
        "television-guide",
        "temperature-celsius",
        "temperature-fahrenheit",
        "temperature-kelvin",
        "tennis",
        "tent",
        "terrain",
        "test-tube",
        "text-shadow",
        "text-to-speech",
        "text-to-speech-off",
        "textbox",
        "texture",
        "theater",
        "thermometer",
        "thermometer-lines",
        "thumb-down",
        "thumb-up",
        "thumbs-up-down",
        "ticket",
        "ticket-account",
        "ticket-confirmation",
        "tie",
        "timelapse",
        "timer",
        "timetable",
        "toggle-switch",
        "toggle-switch-off",
        "tooltip",
        "tooltip-edit",
        "tooltip-image",
        "tooltip-text",
        "tooth",
        "tor",
        "traffic-light",
        "train",
        "tram",
        "transcribe",
        "transcribe-close",
        "transfer",
        "translate",
        "tree",
        "trello",
        "trending-down",
        "trending-neutral",
        "trending-up",
        "triangle",
        "trophy",
        "trophy-award",
        "trophy-variant",
        "truck",
        "truck-delivery",
        "tshirt-crew",
        "tshirt-v",
        "tumblr",
        "tumblr-reblog",
        "tune",
        "tune-vertical",
        "twitch",
        "twitter",
        "twitter-box",
        "twitter-retweet",
        "ubuntu",
        "umbraco",
        "umbrella",
        "undo",
        "undo-variant",
        "unfold-less",
        "unfold-more",
        "ungroup",
        "untappd",
        "upload",
        "usb",
        "vector-arrange-above",
        "vector-arrange-below",
        "vector-combine",
        "vector-curve",
        "vector-difference",
        "vector-difference-ab",
        "vector-difference-ba",
        "vector-intersection",
        "vector-line",
        "vector-point",
        "vector-polygon",
        "vector-polyline",
        "vector-rectangle",
        "vector-selection",
        "vector-square",
        "vector-triangle",
        "vector-union",
        "verified",
        "vibrate",
        "video",
        "video-off",
        "video-switch",
        "view-agenda",
        "view-array",
        "view-carousel",
        "view-column",
        "view-dashboard",
        "view-day",
        "view-grid",
        "view-headline",
        "view-list",
        "view-module",
        "view-quilt",
        "view-stream",
        "view-week",
        "vimeo",
        "vine",
        "violin",
        "visualstudio",
        "vk",
        "vk-box",
        "vlc",
        "voice",
        "voicemail",
        "volume-high",
        "volume-low",
        "volume-medium",
        "volume-off",
        "vpn",
        "walk",
        "wallet",
        "wallet-giftcard",
        "wallet-membership",
        "wallet-travel",
        "wan",
        "watch",
        "watch-export",
        "watch-import",
        "water",
        "web",
        "webcam",
        "webhook",
        "wechat",
        "weight",
        "whatsapp",
        "wheelchair-accessibility",
        "wifi",
        "wifi-off",
        "wii",
        "wikipedia",
        "window-close",
        "window-closed",
        "window-maximize",
        "window-minimize",
        "window-open",
        "window-restore",
        "windows",
        "wordpress",
        "worker",
        "wrap",
        "wrench",
        "wunderlist",
        "xaml",
        "xbox",
        "xbox-controller",
        "xbox-controller-off",
        "xda",
        "xing",
        "xing-box",
        "xml",
        "yeast",
        "yelp",
        "zip-box"
    ]
}

const iconPage = {
    icon_page : [
        "icon-eye",
        "icon-paper-clip",
        "icon-mail",
        "icon-mail",
        "icon-toggle",
        "icon-layout",
        "icon-link",
        "icon-bell",
        "icon-lock",
        "icon-unlock",
        "icon-ribbon",
        "icon-image",
        "icon-signal",
        "icon-target",
        "icon-clipboard",
        "icon-clock",
        "icon-clock",
        "icon-watch",
        "icon-air-play",
        "icon-camera",
        "icon-video",
        "icon-disc",
        "icon-printer",
        "icon-monitor",
        "icon-server",
        "icon-cog",
        "icon-heart",
        "icon-paragraph",
        "icon-align-justify",
        "icon-align-left",
        "icon-align-center",
        "icon-align-right",
        "icon-book",
        "icon-layers",
        "icon-stack",
        "icon-stack-2",
        "icon-paper",
        "icon-paper-stack",
        "icon-search",
        "icon-zoom-in",
        "icon-zoom-out",
        "icon-reply",
        "icon-circle-plus",
        "icon-circle-minus",
        "icon-circle-check",
        "icon-circle-cross",
        "icon-square-plus",
        "icon-square-minus",
        "icon-square-check",
        "icon-square-cross",
        "icon-microphone",
        "icon-record",
        "icon-skip-back",
        "icon-rewind",
        "icon-play",
        "icon-pause",
        "icon-stop",
        "icon-fast-forward",
        "icon-skip-forward",
        "icon-shuffle",
        "icon-repeat",
        "icon-folder",
        "icon-umbrella",
        "icon-moon",
        "icon-thermometer",
        "icon-drop",
        "icon-sun",
        "icon-cloud",
        "icon-cloud-upload",
        "icon-cloud-download",
        "icon-upload",
        "icon-download",
        "icon-location",
        "icon-location-2",
        "icon-map",
        "icon-battery",
        "icon-head",
        "icon-briefcase",
        "icon-speech-bubble",
        "icon-anchor",
        "icon-globe",
        "icon-box",
        "icon-reload",
        "icon-share",
        "icon-marquee",
        "icon-marquee-plus",
        "icon-marquee-minus",
        "icon-tag",
        "icon-power",
        "icon-command",
        "icon-alt",
        "icon-esc",
        "icon-bar-graph",
        "icon-bar-graph-2",
        "icon-pie-graph",
        "icon-star",
        "icon-arrow-left",
        "icon-arrow-right",
        "icon-arrow-up",
        "icon-arrow-down",
        "icon-volume",
        "icon-mute",
        "icon-content-right",
        "icon-content-left",
        "icon-grid",
        "icon-grid-2",
        "icon-columns",
        "icon-loader",
        "icon-bag",
        "icon-ban",
        "icon-flag",
        "icon-trash",
        "icon-expand",
        "icon-contract",
        "icon-maximize",
        "icon-minimize",
        "icon-plus",
        "icon-minus",
        "icon-check",
        "icon-cross",
        "icon-move",
        "icon-delete",
        "icon-menu",
        "icon-archive",
        "icon-inbox",
        "icon-outbox",
        "icon-file",
        "icon-file-add",
        "icon-file-subtract",
        "icon-help",
        "icon-open",
        "icon-ellipsis"
    ]
}

const messages = {
    error: {
        register : "Sorry, something went wrong when registering.",
        incorrect_password : "Password is incorrect. Please try again.",
        user_not_found : "User with this email is not found in our database. Please sign up.",
        internal_error : "Some internal error has occured. We apologize for the inconvinience.",
        not_dev_login : "It seems you have a non developer account, login as a 'User' to access the app.",
        not_user_login : "It seems you have a developer account, login as a 'Developer' to access your dashboard.",
        project_not_found : "The project that you entered is not in our database.",
        unauthorized : "Sorry, but you are unauthorized to access this page.",
        page_not_found : "Oops, the page you want to find doesn't exist.",
        modify_error_header : "Sorry, something went wrong when updating the headers.",
        modify_error_input : "Sorry, something went wrong when updating the inputs.",
        modify_page_webhook : "Sorry, something went wrong when updating the user webhook.",
        modify_page_url : "Sorry, something went wrong when updating the link.",
        modify_error_dashboard_item : "Sorry, something went wrong when updating the existing dashboard.",
        create_error_dashboard_item : "Sorry, something went wrong when creating the new dashboard items.",
        create_error_dashboard_item_headers : "Sorry, something went wrong when creating the new dashboard items headers.",
        create_error_dashboard_item_inputs : "Sorry, something went wrong when creating the new dashboard items inputs.",
        modify_api : "Sorry, something went wrong when updating the API.",
        delete_api : "Sorry, something went wrong when deleting the API.",
        delete_project : "Sorry, something went wrong when deleting the Project.",
        delete_page : "Sorry, something went wrong when deleting the Page.",
        size_too_big : "The file you uploaded is too large (4 MB Max.)",
        create_batch : "Unable to upload batch, please contact the developer.",
        not_activated : "Sorry, your account has not yet been activated. Please wait while our team activates your profile.",
        increment_user_credit : "Sorry, unable to add credits to this user."
    },
    success : {
        login : "Log in succesful. Welcome back.",
        register : "Account created succesfully, you can now login.",
        create_api : "API is succesfully created.",
        create_project : "Project is succesfully created.",
        create_page : "Page is succesfully created.",
        create_plan : "Plan is succesfuly created.",
        modify_page_detail : "Page details are succesfully modified.",
        modify_playground_content : "Playground contents are succesfully modified.",
        modify_dashboard : "Dashboard are succesfully modified.",
        modify_dashboard_content : "Dashboard items are succesfully modified.",
        modify_page_url : "External URL is succesfully modified.",
        modify_page_webhook : "New user webhook is succesfully modified.",
        modify_page_doc : "Markdown is succesfully modified.",
        modify_plan : "Plan is succesfully modified.",
        modify_api : "API is succesfully modified.",
        delete_api : "API is succesfully deleted.",
        delete_page : "Page is succesfully deleted.",
        delete_plan : "Plan is succesfully deleted.",
        create_batch : "Batch uploaded succesfully.",
        modify_batch : "Batch modified succesfully.",
        plan_selected : "Succesfully subscribed to the plan.",
        activate : "Account is succesfully activated.",
        increment_user_credit : "Credits succesfully added for this user"
    },
    info : {
        logout : "Logged out",
        choose_plan : "Choose a plan",
        no_plan_selected : "No plan has been selected."
    }
}

const whiteListedProjectPath = [
    "login", "home", "register", "admin", "manage", "choose-plan"
]

const batchStatus = {
    0 : {
        key : "unprocessed",
        label : "Unprocessed",
        button_type : "Unprocessed",
        button_type : "info"
    }, 1 : {
        key : "processed",
        label : "Processed",
        button_type : "warning"
    }, 2 : {
        key : "completed",
        label : "Completed",
        button_type : "success"
    }, 3 : {
        key : "error",
        label : "Error",
        button_type : "danger"
    }, 4 : {
        key : "terminated",
        label : "Terminated",
        button_type : "warning"
    }
}

module.exports = {
    pageTypes,
	userTypes,
    apiMethod,
    apiOutputType,
    apiInputType,
    iconList,
    iconPage,
    messages,
    whiteListedProjectPath,
    batchStatus
}