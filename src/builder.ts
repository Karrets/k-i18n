import { Modal } from "bootstrap";

function generateRandomId(length = 6): string {
  return Math.random().toString(36).substring(2, length + 2);
};

function createEditButton(): HTMLButtonElement {
    const button = document.createElement('button');

    button.dataset.role = 'edit';
    button.className = 'edit-key btn btn-secondary';
    button.setAttribute('aria-label', 'Edit key');
    button.innerHTML = '<i class="bi bi-pencil"></i>';
    return button;
}

function setEditButtonRole(id: string, role: 'edit' | 'save'): void {
    const editButton = document.getElementById(`${id}-edit-button`) as HTMLButtonElement;
    if (!editButton) return;

    editButton.dataset.role = role;
    if (role === 'edit') {
        editButton.className = 'edit-key btn btn-secondary';
        editButton.setAttribute('aria-label', 'Edit key');
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';
    }
    if (role === 'save') {
        editButton.className = 'save-key btn btn-success';
        editButton.setAttribute('aria-label', 'Save key');
        editButton.innerHTML = '<i class="bi bi-floppy"></i>';
    }
}

function createTranslationEntry(keyName: string, type: string, isRequired: boolean): HTMLDivElement {
    const entry = document.createElement('div');
    entry.className = 'translation-entry input-group';

    // Random ids (not stored, just for session)
    const safeId = generateRandomId();
    entry.id = safeId;
    entry.dataset.entry_id = safeId;

    const editButton = createEditButton();
    editButton.id = safeId + '-edit-button';
    //Button initialized after being added to DOM later.

    // Key input
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.id = safeId + '-key-input';
    keyInput.className = 'form-control';
    keyInput.value = keyName;
    keyInput.setAttribute('aria-label', 'TranslationKey');
    keyInput.disabled = true;

    // Default locale value label + input
    const defaultLabel = document.createElement('span');
    defaultLabel.className = 'input-group-text text-muted pe-3';
    defaultLabel.textContent = `Default: `;

    const defaultInput = document.createElement('input');
    defaultInput.type = 'text';
    defaultInput.id = safeId + '-default-input';
    defaultInput.className = 'form-control';
    defaultInput.value = keyName; // Set default value
    defaultInput.setAttribute('aria-label', 'Default Translation');
    defaultInput.disabled = true;

    // Meta-info
    const metaSpan = document.createElement('span');
    metaSpan.className = 'input-group-text text-muted';
    metaSpan.textContent = `${type} • ${isRequired ? 'required' : 'optional'}`;
    
    // Remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-entry btn btn-danger';
    removeButton.setAttribute('aria-label', 'Remove entry');
    removeButton.innerHTML = '<i class="bi bi-trash"></i>';

    // Assemble entry: [edit][input][metaSpan][removeButton]
    entry.appendChild(editButton);
    entry.appendChild(keyInput);
    entry.appendChild(defaultLabel);
    entry.appendChild(defaultInput);
    entry.appendChild(metaSpan);
    entry.appendChild(removeButton);

    // Wire events
    editButton.addEventListener('click', () => {
        console.log('Edit/save clicked as role:', editButton.dataset.role);
        if(editButton.dataset.role === 'edit') {
            keyInput.dataset.previous = keyInput.value;
            defaultInput.dataset.previous = defaultInput.value;
            keyInput.disabled = false;
            defaultInput.disabled = false;
            setEditButtonRole(safeId, 'save');
        } else if(editButton.dataset.role === 'save') {
            let failed = false;

            
            if(setEntryProperty(safeId, 'default', defaultInput.value)) {
                defaultInput.classList.remove('is-invalid');
                defaultInput.disabled = true;
            } else {
                console.warn('Default input failed validation.');
                defaultInput.classList.add('is-invalid');
                defaultInput.value = defaultInput.dataset.previous || '';
                defaultInput.focus();
                failed = true;
            }

            //Errors on key are more critical, so check last to focus if both failed.
            if(setEntryProperty(safeId, 'key', keyInput.value)) {
                keyInput.classList.remove('is-invalid');
                keyInput.disabled = true;
            } else {
                console.warn('Key input failed validation.');
                keyInput.classList.add('is-invalid');
                keyInput.value = keyInput.dataset.previous || '';
                keyInput.focus();
                failed = true;
            }

            if(failed) return;

            setEditButtonRole(safeId, 'edit');
        }
    });
        
    removeButton.addEventListener('click', () => {
        entry.remove();
    });

    return entry;
}

function setEntryProperty(id: string, prop: string, newKeyName: string): boolean {
    const entry = document.getElementById(id) as HTMLDivElement;
    const keyInput = document.getElementById(`${id}-${prop}-input`) as HTMLInputElement;
    if (!entry || !keyInput || !newKeyName.trim()) return false;

    keyInput.value = newKeyName;
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Key toolbar elements
    const keyNameInput = document.getElementById('key-name') as HTMLInputElement;
    const translationType = document.getElementById('translation-type') as HTMLSelectElement;
    const requiredCheckbox = document.getElementById('required') as HTMLInputElement;
    const keyForm = document.getElementById('key-form') as HTMLFormElement;

    // Locale modal elements and state
    const localeModal = document.getElementById('localeModal') as HTMLDivElement;
    const bsLocaleModal = Modal.getOrCreateInstance(localeModal);
    const localeList = document.getElementById('locale-list') as HTMLUListElement;
    const localeCodeInput = document.getElementById('locale-code-input') as HTMLInputElement;
    const localeNameInput = document.getElementById('locale-name-input') as HTMLInputElement;
    const editLocalesButton = document.getElementById('edit-locale-modal-button') as HTMLButtonElement;
    const localeSelect = document.getElementById('locale-select') as HTMLSelectElement;

    // Translation entries container
    const translationContainer = document.getElementById('translation-container') as HTMLDivElement;

    // Temporary, until persistence / config dir is implemented
    const locales: { code: string; name?: string }[] = [
        { code: 'en', name: 'English' }
    ];

    function renderLocaleList() {
        if (!localeList) return;
        localeList.innerHTML = '';
        locales.forEach((l) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center';
            
            const text = document.createElement('span');
            text.className = 'flex-grow-1';
            text.textContent = `${l.code}${l.name ? ' — ' + l.name : ''}`;

            const makePrimaryButton = document.createElement('button');
            makePrimaryButton.type = 'button';
            makePrimaryButton.className = 'btn btn-sm btn-outline-primary me-2 justify-self-end';
            makePrimaryButton.innerHTML = '<i class="bi bi-star"></i>';

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'btn btn-sm btn-outline-danger justify-self-end';
            removeButton.innerHTML = '<i class="bi bi-trash"></i>';
            removeButton.addEventListener('click', () => {
                const idx = locales.findIndex(x => x.code === l.code);
                if (idx >= 0) locales.splice(idx, 1);
                renderLocaleList();
            });

            li.appendChild(text);
            li.appendChild(makePrimaryButton);
            li.appendChild(removeButton);
            localeList.appendChild(li);
        });
    }

    function syncLocalesToSelect() {
        if (!localeSelect) return;
        localeSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.value = '';
        placeholder.textContent = 'Select locale';
        localeSelect.appendChild(placeholder);

        locales.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.code;
            opt.textContent = l.name ? `${l.code} — ${l.name}` : l.code;
            localeSelect.appendChild(opt);
        });
    }

    editLocalesButton.addEventListener('click', () => {
        renderLocaleList();
        if (bsLocaleModal) bsLocaleModal.show();
    });

    localeModal.addEventListener('hidden.bs.modal', () => {
        editLocalesButton.focus();
    });

    // initial sync
    renderLocaleList();
    syncLocalesToSelect();

    keyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const keyName = keyNameInput.value.trim();
        const type = translationType.value;
        const isRequired = requiredCheckbox.checked;

        if (!keyName || !type) {
            alert('Please enter a key name and translation type.');
            return;
        }
        keyNameInput.value = '';
        translationType.value = '';
        requiredCheckbox.checked = true;
        
        translationContainer.appendChild(createTranslationEntry(keyName, type, isRequired));
    });

    translationContainer.appendChild(createTranslationEntry('example.key', 'basic', true));
});