document.addEventListener('DOMContentLoaded', () => {
    const defaultConfig = {
        "Main": {
            "TOKEN": "",
            "VERSION": "1",
            "AIRLINE_ICAO": "SWA",
            "AIRLINE_NAME": "Southwest",
            "ALLOW_OTHERS_TO_MANAGE_FLIGHT": false
        },
        "Permissions": {
            "ADMINROLES": [],
            "STAFFROLES": []
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

    // Custom descriptions for each field
    const fieldDescriptions = {
        "Main": {
            "TOKEN": "Bot authentication token, find this at discord.com/developers",
            "VERSION": "Config version number, you shouldn't need to change this. The default is",
            "AIRLINE_ICAO": "ICAO code for your airline",
            "AIRLINE_NAME": "Full airline name",
            "ALLOW_OTHERS_TO_MANAGE_FLIGHT": "Allow other staff to manage flights that you or the staff member makes"
        },
        "Permissions": {
            "ADMINROLES": "Role IDs with admin privileges.  Separate with commas (i.e 1262779775618125997,12627797756181483957",
            "STAFFROLES": "Role IDs with staff privileges. Separate with commas (i.e 1262779775618125997,12627797756181483957 "
        },
        "Colors": {
            "DEFAULT": "Primary interface color. The default is",
            "ERROR": "Error message color. The default is",
            "WARNING": "Warning message color. The default is"
        },
        "Emojis": {
            "CHECK": "Success indicator. The default is",
            "ERROR": "Error indicator. The default is",
            "WARN": "Warning indicator. The default is",
            "WAITING": "Processing indicator. The default is"
        }
    };

    function createInputField(key, value, parentElement, sectionKey) {
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
        // Use custom description if available, fallback to default value
        const description = fieldDescriptions[sectionKey][key] || 'Default';
        currentSpan.textContent = `${description}: ${Array.isArray(value) ? value.join(',') : value}`;
        wrapper.appendChild(currentSpan);

        div.appendChild(wrapper);
        parentElement.appendChild(div);
    }

    function populateForm(config) {
        const sections = {
            'mainSection': 'Main',
            'permissionsSection': 'Permissions',
            'colorsSection': 'Colors',
            'emojisSection': 'Emojis'
        };

        for (const [sectionId, sectionKey] of Object.entries(sections)) {
            const sectionElement = document.getElementById(sectionId);
            if (!sectionElement) {
                console.error(`Section element with ID '${sectionId}' not found`);
                return;
            }
            const sectionData = config[sectionKey];
            
            for (const [key, value] of Object.entries(sectionData)) {
                createInputField(key, value, sectionElement, sectionKey);
            }
        }
    }

    function getFormData() {
        const newConfig = JSON.parse(JSON.stringify(defaultConfig));
        const inputs = document.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            const sectionElement = input.closest('.section');
            if (!sectionElement) return;
            
            const sectionId = sectionElement.id;
            let sectionKey;
            
            switch(sectionId) {
                case 'mainSection': sectionKey = 'Main'; break;
                case 'permissionsSection': sectionKey = 'Permissions'; break;
                case 'colorsSection': sectionKey = 'Colors'; break;
                case 'emojisSection': sectionKey = 'Emojis'; break;
                default: return;
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

    const downloadBtn = document.getElementById('downloadBtn');
    if (!downloadBtn) {
        console.error("Download button not found");
        return;
    }

    downloadBtn.addEventListener('click', () => {
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
});