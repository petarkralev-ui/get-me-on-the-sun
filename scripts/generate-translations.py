#!/usr/bin/env python3
"""Generate the site's translation catalogue from visible English HTML text."""

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
import time


ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = {"es": "Spanish", "ru": "Russian", "bg": "Bulgarian"}
SKIP = {"Get Me On The Sun", "NIE", "IGIC", "RIC", "R&D", "ZEC"}
ICON_ONLY = re.compile(r"^[\W\d_]+$", re.UNICODE)
SHORT_CODE = re.compile(r"^[A-Z0-9&.\- ]{1,12}$")

# Reviewed overrides for legal, financial, and service language where a literal
# machine translation would be unclear or could change the intended meaning.
OVERRIDES = {
    "es": {
        "A remote property viewing through smart glasses at sunset": "Una visita remota a una propiedad mediante gafas inteligentes al atardecer",
        "We package your mortgage file properly": "Preparamos correctamente su expediente hipotecario",
        "Your purchase starts": "Su compra comienza",
        "with the right setup.": "con la preparación adecuada.",
        "Arrive ready": "Llegue preparado",
        "to get things done.": "para completar sus gestiones.",
        "Ownership should": "Tener una propiedad debería",
        "feel supported.": "darle tranquilidad.",
        "Think beyond": "Piense más allá",
        "the purchase price.": "del precio de compra.",
        "Getting There": "Cómo llegar",
        "After the keys": "Después de recibir las llaves",
        "We stay with you through the Spanish-speaking steps": "Le acompañamos durante todos los trámites en español",
        "Company and local management": "Sociedad y gestión local",
        "Complete Spanish formalities": "Completar los trámites en España",
        "Activate and maintain the company": "Poner en marcha y mantener la sociedad",
        "A practical EU route for growing into Tenerife": "Una vía práctica desde la UE para crecer en Tenerife",
        "Build a clear commercial case": "Preparar una justificación comercial clara",
        "Joined-up admin for wider plans": "Administración coordinada para proyectos más amplios",
        "UK share exchanges": "Canjes de participaciones en el Reino Unido",
        "No automatic stacking": "Los incentivos no se acumulan automáticamente",
    },
    "ru": {
        "A remote property viewing through smart glasses at sunset": "Удаленный просмотр недвижимости через умные очки на закате",
        "We book and manage your NIE appointment early": "Мы заранее записываем вас на получение NIE и организуем визит",
        "Your purchase starts": "Ваша покупка начинается",
        "with the right setup.": "с правильной подготовки.",
        "Arrive ready": "Приезжайте подготовленными",
        "to get things done.": "к важным встречам и делам.",
        "Ownership should": "Владение недвижимостью должно",
        "feel supported.": "приносить вам спокойствие.",
        "Think beyond": "Учитывайте не только",
        "the purchase price.": "стоимость покупки.",
        "We package your mortgage file properly": "Мы правильно готовим ваш ипотечный пакет документов",
        "We keep the bank process moving": "Мы сопровождаем банковский процесс на каждом этапе",
        "We stay with you through the Spanish-speaking steps": "Мы сопровождаем вас на всех этапах, требующих общения на испанском языке",
        "Open Bankinter simulator →": "Открыть симулятор Bankinter →",
        "We help assess the right rental route before you advertise": "До публикации объявления мы помогаем выбрать подходящий законный формат аренды",
        "A practical EU route for growing into Tenerife": "Практический путь для бизнеса из ЕС, планирующего развитие на Тенерифе",
        "Exchange shares instead of funding a cash purchase": "Рассмотреть обмен долей вместо финансирования покупки денежными средствами",
        "Build a clear commercial case": "Подготовить четкое коммерческое обоснование",
        "A UK parent can own a Spanish S.L.": "Британская материнская компания может владеть испанской S.L.",
        "No automatic stacking": "Льготы не суммируются автоматически",
        "UK share exchanges": "Обмен долей в Великобритании",
        "Joined-up admin for wider plans": "Согласованное административное сопровождение более широких проектов",
    },
    "bg": {
        "A remote property viewing through smart glasses at sunset": "Дистанционен оглед на имот чрез смарт очила по залез",
        "We book and manage your NIE appointment early": "Запазваме предварително вашия час за NIE и организираме посещението",
        "Your purchase starts": "Вашата покупка започва",
        "with the right setup.": "с правилната подготовка.",
        "Arrive ready": "Пристигнете подготвени",
        "to get things done.": "за важните срещи и задачи.",
        "Ownership should": "Притежаването на имот трябва",
        "feel supported.": "да ви носи спокойствие.",
        "Think beyond": "Мислете отвъд",
        "the purchase price.": "покупната цена.",
        "We package your mortgage file properly": "Подготвяме правилно документите за ипотечното ви проучване",
        "We keep the bank process moving": "Съпровождаме банковия процес на всеки етап",
        "We stay with you through the Spanish-speaking steps": "Съпровождаме ви във всички етапи, които изискват комуникация на испански",
        "We identify the right document before booking": "Преди записването уточняваме кой документ е необходим",
        "EU citizens moving for more than three months": "Граждани на ЕС, които се преместват за повече от три месеца",
        "We help assess the right rental route before you advertise": "Преди да публикувате обява, ви помагаме да изберете подходящия законен вид отдаване под наем",
        "Keeping small problems small": "Решаваме малките проблеми навреме",
        "We keep local eyes on the property": "Осигуряваме местен надзор на имота",
        "A practical EU route for growing into Tenerife": "Практичен път за бизнес от ЕС, който иска да се развива в Тенерифе",
        "Company and local management": "Дружество и местно управление",
        "Prepare foreign documents": "Подготовка на чуждестранните документи",
        "Complete Spanish formalities": "Завършване на формалностите в Испания",
        "Activate and maintain the company": "Стартиране и текущо обслужване на дружеството",
        "Build a clear commercial case": "Подготовка на ясна търговска обосновка",
        "A UK parent can own a Spanish S.L.": "Британско дружество майка може да притежава испанско S.L.",
        "Reinvestment of Canary profits": "Реинвестиране на печалбата, реализирана на Канарските острови",
        "No automatic stacking": "Стимулите не се комбинират автоматично",
        "Import and export guidance": "Насоки за внос и износ",
        "Joined-up admin for wider plans": "Координирано административно обслужване за по-широки планове",
        "UK share exchanges": "Замяна на дялове в Обединеното кралство",
    },
}


class VisibleTextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.texts = []

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.skip_depth += 1
        if not self.skip_depth:
            for name, value in attrs:
                if name in {"alt", "title", "placeholder"} and value:
                    text = " ".join(value.split())
                    if text and text not in SKIP:
                        self.texts.append(text)

    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.skip_depth:
            self.skip_depth -= 1

    def handle_data(self, data):
        if self.skip_depth:
            return
        text = " ".join(data.split())
        if not text or text in SKIP or ICON_ONLY.fullmatch(text) or SHORT_CODE.fullmatch(text):
            return
        self.texts.append(text)


def collect_texts():
    texts = []
    for path in sorted(ROOT.glob("*.html")):
        parser = VisibleTextParser()
        parser.feed(path.read_text(encoding="utf-8"))
        texts.extend(parser.texts)
    return list(dict.fromkeys(texts))


def translate(text, language, attempts=4):
    for attempt in range(attempts):
        try:
            result = subprocess.run(
                [
                    "curl", "--fail", "-sS", "--get",
                    "https://translate.google.com/translate_a/single",
                    "--data-urlencode", "client=gtx",
                    "--data-urlencode", "sl=en",
                    "--data-urlencode", f"tl={language}",
                    "--data-urlencode", "dt=t",
                    "--data-urlencode", f"q={text}",
                ],
                check=True,
                capture_output=True,
                text=True,
                timeout=45,
            )
            payload = json.loads(result.stdout)
            return "".join(part[0] for part in payload[0] if part and part[0])
        except Exception:
            if attempt == attempts - 1:
                raise
            time.sleep(1.5 * (attempt + 1))


def make_batches(texts, max_characters=3800):
    batches = []
    current = []
    size = 0
    for text in texts:
        addition = len(text) + 24
        if current and size + addition > max_characters:
            batches.append(current)
            current = []
            size = 0
        current.append(text)
        size += addition
    if current:
        batches.append(current)
    return batches


def translate_batch(texts, language):
    marker = "[[[SITE_TEXT_SPLIT]]]"
    translated = translate(("\n" + marker + "\n").join(texts), language)
    parts = [part.strip() for part in translated.split(marker)]
    if len(parts) != len(texts):
        raise RuntimeError(
            f"Translation batch split failed for {language}: "
            f"expected {len(texts)} parts, received {len(parts)}"
        )
    return dict(zip(texts, parts))


def main():
    texts = collect_texts()
    cache_path = ROOT / "scripts" / ".translation-cache.json"
    if cache_path.exists():
        catalogue = json.loads(cache_path.read_text(encoding="utf-8"))
    else:
        catalogue = {code: {} for code in LANGUAGES}

    for code, name in LANGUAGES.items():
        catalogue.setdefault(code, {})
        catalogue[code].update(OVERRIDES.get(code, {}))
        missing = [text for text in texts if text not in catalogue[code]]
        batches = make_batches(missing)
        for index, batch in enumerate(batches, start=1):
            catalogue[code].update(translate_batch(batch, code))
            print(
                f"{name}: batch {index}/{len(batches)}",
                file=sys.stderr,
                flush=True,
            )
            time.sleep(0.5)

    for code in catalogue:
        catalogue[code] = {text: catalogue[code][text] for text in texts}
        catalogue[code].update({
            text: translation
            for text, translation in OVERRIDES.get(code, {}).items()
            if text in texts
        })

    cache_path.write_text(
        json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    output = "window.SITE_TRANSLATIONS = " + json.dumps(
        catalogue, ensure_ascii=False, separators=(",", ":")
    ) + ";\n"
    (ROOT / "translations.js").write_text(output, encoding="utf-8")
    print(f"Wrote {len(texts)} English strings in {len(LANGUAGES)} languages.")


if __name__ == "__main__":
    main()
