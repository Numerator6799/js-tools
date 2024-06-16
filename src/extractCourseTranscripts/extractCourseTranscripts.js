TIME_TO_WAIT = 10000

extractedLessonInfos = [];
sectionTitleAndNumberExp = /Section (?<number>\d+): (?<title>.*?), Lecture \d+:/
lessonTitleAndNumberExp = /Lecture (?<number>\d+): (?<title>.*)/
sectionOrLessonNumberExp = /(?<number>\d)+:/
sectionsContainer = document.querySelector("[data-purpose='curriculum-section-container']")

// TODO: fix this
if (!sectionsContainer)
    console.log("Could not get total number of sections. Ensure you are in the course page, with 'Course content' tab selected.")

totalSections = sectionsContainer.children.length;

console.log("number of sections: " + totalSections)

function extractLessonInfo() {
    let sectionTitle = "";
    let lessonTitle = "";
    const lessonInfoContainer = document
        .querySelector("[data-purpose='curriculum-item-viewer-content']")
    if (lessonInfoContainer) {
        const lessonInfo = lessonInfoContainer.children[0].attributes["aria-label"]?.value;
        if (lessonInfo) {
            const sectionInfo = lessonInfo.match(sectionTitleAndNumberExp)
            const lectureInfo = lessonInfo.match(lessonTitleAndNumberExp)
            sectionTitle = sectionInfo.groups.title
            sectionNumber = parseInt(sectionInfo.groups.number)
            lessonTitle = lectureInfo.groups.title
            lessonNumber = parseInt(lectureInfo.groups.number)
        }
    }

    const cues = document.querySelectorAll("[data-purpose='transcript-cue']");
    let lessonTranscript = ''
    cues.forEach(cue => {
        const text = cue.querySelector("[data-purpose='cue-text']").innerText
        lessonTranscript += text + ' '
    })

    return {
        sectionTitle,
        sectionNumber,
        lessonTitle,
        lessonNumber,
        lessonTranscript
    }
}

function offerContentToDownloadAsJson(content, filename = "data.json") {
    const data = JSON.stringify(content)
    var blob = new Blob([data], { type: 'text/json' }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function getElementToNextLesson() {
    console.log("getting next arrow element....")
    let next = document.getElementById("go-to-next-item");
    if (!next) {
        // maybe it's a quiz or a text lesson
        console.log("getting continue or skip button...")
        next = document.querySelector("[data-purpose='go-to-next']");
    }
    return next;
}

function tryShowTranscriptPanel() {
    console.log("looking for panel")
    const panel = document.querySelector("[data-purpose='transcript-panel']")
    if (panel)
        return true;
    console.log("looking for toggle")
    const toggle = document.querySelector("[data-purpose='transcript-toggle']");
    if (!toggle) {
        console.log("toggle does not exist, returning")
        return false
    }
    console.log("clicking on toggle")
    toggle.click()
    return true;
}

console.log("starting, please wait!")
// using setInterval with some assumed time is just crazy, 
// but I can't get it to work using async/await without freezing the browser
t = setInterval(() => {
    try {

        tryShowTranscriptPanel()

        const lessonInfo = extractLessonInfo()
        console.log(lessonInfo)
        if (lessonInfo.lessonTitle)
            extractedLessonInfos.push(lessonInfo)

        const next = getElementToNextLesson();
        if (next) {
            console.log("got next element, clicking...")
            next.click();
        }
        else {
            if (lessonInfo.sectionNumber < totalSections) {
                return; // don't try to save yet, this is not the end and maybe the page didn't load
            }
            clearInterval(t)
            console.log("done, saving file...")
            offerContentToDownloadAsJson(extractedLessonInfos, "courseTranscripts.json")
        }
    }
    catch (err) {
        console.error(err)
        clearInterval(t)
    }
}, TIME_TO_WAIT)

