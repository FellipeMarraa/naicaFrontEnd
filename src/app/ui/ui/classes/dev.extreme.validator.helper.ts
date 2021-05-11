import validationEngine from "devextreme/ui/validation_engine";
import * as _ from "lodash";
import {DxComponent, DxValidatorComponent} from "devextreme-angular";
import {DxiValidationRuleComponent, DxiValidationRuleModule} from "devextreme-angular/ui/nested";
import {Rules} from "tslint";

export class DevExtremeValidatorHelperMetadata {
    key: string;
    isUUIDKey: boolean;
}

export class DevExtremeValidatorHelper {

    private static isEmpty(val: any) {
        return val == null || typeof val == "undefined" || val.toString().trim() == "";
    }

    static validate(targetData: any, data: DevExtremeValidatorHelperMetadata[]): boolean {
        Object.keys(targetData).forEach(prop => {
            if (!_.isArray(targetData[prop]) && this.isEmpty(targetData[prop])) {
                targetData[prop] = null;
            }
        });

        let isValid = true; // true by default
        for (const group of this.getGroups(data)) {
            const validation = group.validate();

            if (isValid && !validation.isValid) {
                isValid = false;
            }
        }

        return isValid;
    }

    static validateGroup(validationGroup): boolean {
        let isValid = true; //true by default;
        const group = this.findGroup(validationGroup);
        const validation = group.validate();

        if (group && !validation.isValid) {
            isValid = false;
        }
        return isValid;
    }

    static getGroups(data: DevExtremeValidatorHelperMetadata[]) {
        const groups: any[] = [];
        for (const group of this.getValidationEngine()['groups']) {
            for (const metadata of data) {
                if (metadata.isUUIDKey && group.group && group.group.data && group.group.data['__KEY__'] == metadata.key) {
                    groups.push(group);
                } else if (metadata.key && group.group == metadata.key) {
                    groups.push(group);
                }
            }
        }
        return groups;
    }


    static getValidationEngine() {
        return validationEngine;
    }

    static findGroup(validationGroup) {
        let group = null;
        let groups = this.getValidationEngine()['groups'];
        if (!_.isEmpty(groups)) {
            group = groups.find(group => {
                return validationGroup == group.group
            });
            return group;
        } else {
            throw Error("ValidationGroup não encontrado: " + validationGroup);
        }
    }

    static resetGroup(validationGroup) {
        if (validationGroup) {
            const group = DevExtremeValidatorHelper.findGroup(validationGroup);
            if (group) {
                group.reset();
            }
        }
    }

    static resetValidatorsByValidationGroup(validationGroup) {
        if (validationGroup) {
            const group = DevExtremeValidatorHelper.findGroup(validationGroup);
            if (group) {
                if (group && !_.isEmpty(group.validators)) {
                    for (let validator of group.validators) {
                        validator.reset();
                    }
                }
            }
        }
    }

    static getValidators(validationGroup) {
        if (validationGroup) {
            const group = DevExtremeValidatorHelper.findGroup(validationGroup);
            if (group) {
                if (group && !_.isEmpty(group.validators)) {
                    return group.validators;
                }
            }
        }
        return [];
    }

    static applyValidatorsByPass(validationGroup, doByPass: boolean) {
        const validators = this.getValidators(validationGroup);
        if (!_.isEmpty(validators)) {
            validators.forEach(validator => {
                const adapter = validator.option('adapter');
                if (adapter) {
                    adapter.bypass = function () {
                        return doByPass;
                    }
                }
            });

            if (doByPass) {
                DevExtremeValidatorHelper.resetValidatorsByValidationGroup(validationGroup);
            }

        }

    }

    static resetStyleComponent(component: DxComponent, isValid?: boolean){
        if(component.instance && component.instance.option) {
            component.instance.option('isValid', _.isNil(isValid) ? true : isValid)
        }
    }

    static forceValidateOnValidatorComponent(validator: DxValidatorComponent, isValid: boolean, message?: string) {

        const validateRule =  [{
            isValid: isValid,
            message: message,
            validator: validator,
            type: "custom",
            validationCallback: () => {}
        }];

        let rulesOld = validator.instance['_validationRules'];

        validator.instance['_validationRules'] = validateRule;
        validator.instance.validate();
        validator.instance['_validationRules'] = rulesOld;

    }
}
