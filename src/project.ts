import execa from 'execa';
import fixturify from 'fixturify';
import { Project } from 'fixturify-project';
import deepmerge from 'deepmerge';

const ROOT = process.cwd();

export default class BinTesterProject extends Project {
  private _dirChanged = false;

  constructor(name = 'fake-project', version?: string, cb?: (project: Project) => void) {
    super(name, version, cb);

    this.pkg = Object.assign({}, this.pkg, {
      license: 'MIT',
      description: 'Fake project',
      repository: 'http://fakerepo.com',
    });
  }

  gitInit() {
    return execa(`git init -q ${this.baseDir}`);
  }

  async chdir() {
    this._dirChanged = true;

    await this.write();

    process.chdir(this.baseDir);
  }

  writeJSON(dirJSON: fixturify.DirJSON) {
    this.files = deepmerge(this.files, dirJSON);

    return this.write();
  }

  dispose() {
    if (this._dirChanged) {
      process.chdir(ROOT);
    }

    return super.dispose();
  }
}
