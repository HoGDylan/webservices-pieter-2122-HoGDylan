Deze api dient om informatie over de personages uit de verschillende intergeconnecteerde boekenseries van Brandon Sanderson bij te houden.

De app wordt opgestart met het commando "yarn start" waarna met postman (of in de browser via localhost) de api calls kunnen worden gemaakt.

Het aanmelden gebeurt via een POST call op api/users/login. Om in te loggen als gebruiker dient het e-mailadres "dylanrathe@hotmail.com", om in te loggen als admin is er het e-mailadres "brandonsanderson@example.com". Beide hebben als wachtwoord "12345678" gekregen.

Na het aanmelden zijn verschillende api routes beschikbaar: api/characters, api/books/, api/users.
Er is ook een api/health/ping die dient om te checken of de app wel draait.
