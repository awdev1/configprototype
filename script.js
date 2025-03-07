const defaultConfig = {
            "Main": {
                "TOKEN": "",
                "VERSION": "1",
                "AIRLINE_ICAO": "SWA",
                "AIRLINE_NAME": "Southwest",
                "ALLOW_OTHERS_TO_MANAGE_FLIGHT": false
            },
            "Permissons": {
                "ADMINROLES": [1334275139428417687],
                "STAFFROLES": [1334275109577429134]
            },
            "Colors": {
                "DEFAULT": "#1b2d83",
                "ERROR": "#ED2939",
                "WARNING": "#f7a714"
            },
            "Emojis": {
                "CHECK": ":check:",
                "ERROR": ":no:",
                "WARN": ":warn:",
                "WAITING": ":waiting:"
            }
        };

        function createInputField(key, value, parentElement) {
            const div = document.createElement('div');
            div.className = 'field';
            
            const label = document.createElement('label');
            label.textContent = key;
            div.appendChild(label);

            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';

            let input;
            if (typeof value === 'boolean') {
                input = document.createElement('select');
                ['true', 'false'].forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    if (value.toString() === opt) option.selected = true;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.value = Array.isArray(value) ? value.join(',') : value;
            }
            
            input.name = key;
            wrapper.appendChild(input);

            const currentSpan = document.createElement('div');
            currentSpan.className = 'current-value';
            currentSpan.textContent = `Default: ${Array.isArray(value) ? value.join(',') : value}`;
            wrapper.appendChild(currentSpan);

            div.appendChild(wrapper);
            parentElement.appendChild(div);
        }

        function populateForm(config) {
            const sections = {
                'mainSection': 'Main',
                'permissionsSection': 'Permissons',
                'colorsSection': 'Colors',
                'emojisSection': 'Emojis'
            };

            for (const [sectionId, sectionKey] of Object.entries(sections)) {
                const sectionElement = document.getElementById(sectionId);
                const sectionData = config[sectionKey];
                
                for (const [key, value] of Object.entries(sectionData)) {
                    createInputField(key, value, sectionElement);
                }
            }
        }

        function getFormData() {
            const newConfig = JSON.parse(JSON.stringify(defaultConfig));
            const inputs = document.querySelectorAll('input, select');
            
            inputs.forEach(input => {
                const sectionElement = input.closest('.section');
                const sectionId = sectionElement.id;
                let sectionKey;
                
                switch(sectionId) {
                    case 'mainSection': sectionKey = 'Main'; break;
                    case 'permissionsSection': sectionKey = 'Permissons'; break;
                    case 'colorsSection': sectionKey = 'Colors'; break;
                    case 'emojisSection': sectionKey = 'Emojis'; break;
                }

                const key = input.name;
                let value = input.value;

                if (input.tagName === 'SELECT') {
                    value = value === 'true';
                } else if (defaultConfig[sectionKey][key] instanceof Array) {
                    value = value.split(',').map(v => isNaN(v) ? v : parseInt(v.trim()));
                }

                newConfig[sectionKey][key] = value;
            });

            return newConfig;
        }

        document.getElementById('downloadBtn').addEventListener('click', () => {
            const configData = getFormData();
            const jsonString = JSON.stringify(configData, null, 4);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'config.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        // Initialize the form
        populateForm(defaultConfig);
