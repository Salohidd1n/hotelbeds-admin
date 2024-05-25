import { useEffect, useState } from 'react';

const EIMZOClient = window.EIMZOClient;
const EIMZO_MAJOR = 3;
const EIMZO_MINOR = 37;

var errorCAPIWS =
  'Ошибка соединения с E-IMZO. Возможно у вас не установлен модуль E-IMZO или Браузер E-IMZO.';
var errorBrowserWS =
  'Браузер не поддерживает технологию WebSocket. Установите последнюю версию браузера.';
var errorUpdateApp =
  'ВНИМАНИЕ !!! Установите новую версию приложения E-IMZO или Браузера E-IMZO.<br /><a href="https://e-imzo.uz/main/downloads/" role="button">Скачать ПО E-IMZO</a>';
var errorWrongPassword = 'Пароль неверный.';

const checkVersion = () => {
	return new Promise((resolve, reject) => {
		EIMZOClient.API_KEYS = [
			'localhost',
			'96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
			'127.0.0.1',
			'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
			'null',
			'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
			'dls.yt.uz',
			'EDC1D4AB5B02066FB3FEB9382DE6A7F8CBD095E46474B07568BC44C8DAE27B3893E75B79280EA82A38AD42D10EA0D600E6CE7E89D1629221E4363E2D78650516',
			'sudijro.agrobank.uz',
			'1CADD4F37260C64B82D2187CD6054A94BBEB50563EA8B2912BF77D1CFFBC95CA11245684B78CC249BCE29B18841FB6513F78655867F1B1D1B2AEAE5F714B0710',
		];

		EIMZOClient.checkVersion(
			function (major, minor) {
				var newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
				var installedVersion = parseInt(major) * 100 + parseInt(minor);
				if (installedVersion < newVersion) {
					reject({ message: errorUpdateApp });
					// uiShowMessage(errorUpdateApp);
				} else {
					EIMZOClient.installApiKeys(
						function () {
							resolve();
							// uiLoadKeys();
						},
						function (e, r) {
							if (r) {
								reject({ message: r });
								// uiShowMessage(r);
							} else if (e) {
								reject({ message: errorCAPIWS });
								// uiShowMessage(errorCAPIWS + " : " + e);
							} else {
								reject({ message: errorBrowserWS });
								// uiShowMessage(errorBrowserWS);
							}
						}
					);
				}
			},
			function (e, r) {
				if (r) {
					reject({ message: r });
					// uiShowMessage(r);
				} else if (e) {
					reject({ message: errorCAPIWS });
					// uiNotLoaded(e);
				} else {
					reject({ message: errorBrowserWS });
				}
			}
		);
	});
};

const computeKey = (itmkey, vo) => {
	return {
		key: itmkey,
		...vo,
	};
};

const loadKeys = () => {
	return new Promise((resolve, reject) => {
		EIMZOClient.listAllUserKeys(
			function (o, i) {
				var itemId = 'itm-' + o.serialNumber + '-' + i;
				return itemId;
			},
			function (itemId, v) {
				return computeKey(itemId, v);
			},
			function (items, firstId) {
				resolve(items);
			},
			function (e, r) {
				if (e) {
					reject({ message: errorCAPIWS + ' : ' + e });
				} else {
					reject({ message: r });
				}
			}
		);
		// EIMZOClient.idCardIsPLuggedIn(
		//   function (yes) {
		//     document.getElementById("plugged").innerHTML = yes
		//       ? "подключена"
		//       : "не подключена";
		//   },
		//   function (e, r) {
		//     if (e) {
		//       uiShowMessage(errorCAPIWS + " : " + e);
		//     } else {
		//       console.log(r);
		//     }
		//   }
		// );
	});
};

export function useESPKeys() {
	const [keys, setKeys] = useState([]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				await checkVersion();
				const keys = await loadKeys();
				setKeys(keys);
			} catch (error) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	return { error, keys, isLoading };
}
