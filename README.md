
<img width="255" alt="blockey" src="https://user-images.githubusercontent.com/29052/41507562-d2d348da-7234-11e8-8fdc-4b31f7f18e94.png">

# Blockey
KYC system using European bank's API ([PSD2 directive](https://ec.europa.eu/info/law/payment-services-psd-2-directive-eu-2015-2366_e))


Created on [Warsaw Blockathon 2018](http://blockathon.pl/)

# Concept
To simplify KYC process we introduced a system which verifies users identity based on his account in any European bank. We use bank open API's provided by [PSD2 directive](https://ec.europa.eu/info/law/payment-services-psd-2-directive-eu-2015-2366_e) to confirm user personal data
and assign it to user wallet address. We store such assignment in a public blockchain so that any 3rd party can easily use it to assign user to his wallet and skip the KYC process.

Keep in mind that we don't store any personal data on the blockchain but just the hash which can be used only for comparison but not for retrieving data so that we don't break GDPR.

## Cooperation
[Alior Bank](https://www.aliorbank.pl/en) 

## Frontend
http://github.com/pbrudny/blockey-react

## Architecture
![blockeyready](https://user-images.githubusercontent.com/29052/41507314-a68029c8-7230-11e8-81f4-32ecdf1dec7d.png)

### Local setup
```
yarn install
yarn start
```
* running on http://localhost:8000

## Contributors
* [Jakub Włodarczyk](https://github.com/fenris85)
* [Bartłomiej Rutkowski](https://github.com/anze1m)
* [Piotr Brudny](https://github.com/pbrudny)
* [Justyna Broniszewska](https://github.com/justynabroniszewska)
* [Łukasz Misiak]()
* [Piotr Sobczak]()

## License
Blockey is released under the MIT License.