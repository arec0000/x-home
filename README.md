### Проект со 2 курса Школы Икс, модуль "Умный дом" (конец февраля - начало апреля 2022)

### Суть модуля в том, что мы разбились на 4 команды по 15 человек, и каждая команда на 3 отдела
- IT (датчики, приложение)
- Робототехника (робот, который возил вещи по комнатам)
- Строительство (план дома, технологии строительства, расчёты)

И ещё у 1 курса в этот момент проходил модуль "RapidFarm" (команды 7-8 человек), где они делали умные теплицы, и нам нужно было интегрировать 2 теплицы в дом

### Наш IT отдел
- Даниил Балябин (датчики)
- Семён Ермолинский (распознавание лиц, для открытия двери)
- Андрей Фоменко (лендинг)
- Никита Соловьёв (front, back, deploy)
- Кристина Манацкая (front, back)

### В этом репозитории только web часть, поэтому дальше будет только про неё

Наша задача состояла в том, чтобы сделать любое приложение, в котором можно получать данные с датчиков и управлять умным домом, никаких пар связанных с этим не было.

Мы (Никита и Кристина) на тот момент уже около полугода изучали фронт-энд (с осени 2021) и начинали изучать react. И на этом модуле мы решили попробовать применить знания на практике + изучить что-то новое. Так что это был наш первый полноценный проект.

### frontend
Мы выбрали классовые компоненты, потому что в курсе, который мы проходили, сначала рассказывали про них, чтобы понимать как раньше делали react приложения. И на тот момент мы ещё не дошли до функциональных.

### backend
Бэк мы решили делать на вебсокетах, потому что у нас было много данных, которые должны были передаваться в реальном времени (датчики, данные от робота). До этого мы вообще не работали в бэком, поэтому разбирались во всём на ходу. База данных просто хранила текущие значения с датчиков, чтобы при перезагрузке бэка, он мог выдавать последние значения, вообще можно было и без этого.

