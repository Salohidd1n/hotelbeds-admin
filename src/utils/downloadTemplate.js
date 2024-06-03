const downloadTemplate = (filename) => {
	const a = document.createElement('a');
	a.href =
    'https://firebasestorage.googleapis.com/v0/b/app-snab.appspot.com/o/jpcode_csv_template.csv?alt=media&token=4c0e20bd-7997-4f67-9f6c-f5d8e8f3376a';
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	setTimeout(() => {
		const a2 = document.createElement('a');
		a2.href =
      'https://firebasestorage.googleapis.com/v0/b/app-snab.appspot.com/o/jpcode_csv_template.xlsx?alt=media&token=025d1193-342c-485a-a568-bd9812859975';
		a2.download = filename;
		document.body.appendChild(a2);
		a2.click();
		document.body.removeChild(a2);
	}, 1000);
};

export default downloadTemplate;
